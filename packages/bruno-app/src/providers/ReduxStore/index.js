import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import {
  findCollectionByUid,
  findItemInCollection,
  findItemInCollectionByPathname,
  getDefaultRequestPaneTab
} from 'utils/collections/index';
import { itemIsOpenedInTabs } from 'utils/tabs/index';
import appReducer, { completeQuitFlow, removeEventsFromQueue } from './slices/app';
import collectionsReducer from './slices/collections';
import tabsReducer, { addTab, closeTabs, focusTab, setShowConfirmClose } from './slices/tabs';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: (action) => ['app/insertEventsIntoQueue', 'app/removeEventsFromQueue'].includes(action.type),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const { tabs } = state.tabs;
    const [event] = state.app.eventsQueue;
    if (!event) return;
    if (event.eventType === 'CLOSE_APP') {
      return listenerApi.dispatch(completeQuitFlow());
    }
    const { itemUid, itemPathname, collectionUid, eventType } = event;
    let eventItem = null;
    // waiting until item is added into collection (only happens after IO completes) before handling event
    if (event.eventType === 'OPEN_REQUEST') {
      await listenerApi.condition((action, currentState, originalState) => {
        const { collections } = currentState.collections;
        const collection = findCollectionByUid(collections, collectionUid);
        const item = findItemInCollectionByPathname(collection, itemPathname);
        if (item) eventItem = item;
        return !!item;
      });
    } else {
      const { collections } = state.collections;
      const collection = findCollectionByUid(collections, collectionUid);
      const item = findItemInCollection(collection, itemUid);
      if (item) eventItem = item;
    }
    if (eventItem) {
      console.log('Will handle event:', eventType);
      switch (eventType) {
        case 'OPEN_REQUEST':
          return listenerApi.dispatch(
            itemIsOpenedInTabs(eventItem, tabs)
              ? focusTab({
                  uid: eventItem.uid
                })
              : addTab({
                  uid: eventItem.uid,
                  collectionUid,
                  requestPaneTab: getDefaultRequestPaneTab(eventItem)
                })
          );
        case 'CLOSE_REQUEST':
          return listenerApi.dispatch(
            setShowConfirmClose({
              tabUid: eventItem.uid,
              showConfirmClose: true
            })
          );
      }
    }
  }
});

const handleTabOpen = (action, listenerApi) => {
  let { uid, collectionUid } = action.payload;
  const state = listenerApi.getState();
  const { eventsQueue } = state.app;
  const { collections } = state.collections;
  const { tabs } = state.tabs;
  const firstEvent = eventsQueue[0];
  if (firstEvent && firstEvent.eventType == 'OPEN_REQUEST') {
    collectionUid = collectionUid ?? tabs.find((t) => t.uid === uid).collectionUid;
    const collection = findCollectionByUid(collections, collectionUid);
    const item = findItemInCollection(collection, uid);
    const eventToRemove =
      (firstEvent.itemUid === item.uid || firstEvent.itemPathname === item.pathname) &&
      firstEvent.eventType === 'OPEN_REQUEST'
        ? firstEvent
        : null;
    if (eventToRemove) {
      listenerApi.dispatch(removeEventsFromQueue([eventToRemove]));
    }
  }
};

listenerMiddleware.startListening({
  predicate: (action) => ['tabs/addTab', 'tabs/focusTab'].includes(action.type),
  effect: handleTabOpen
});

listenerMiddleware.startListening({
  actionCreator: closeTabs,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const { tabUids } = action.payload;
    const { eventsQueue } = state.app;
    const firstEvent = eventsQueue[0];
    if (!firstEvent || firstEvent.eventType !== 'CLOSE_REQUEST') return;
    const eventToRemove = tabUids.some((uid) => uid === firstEvent.itemUid) ? firstEvent : null;
    if (eventToRemove) {
      listenerApi.dispatch(removeEventsFromQueue([eventToRemove]));
    }
  }
});

listenerMiddleware.startListening({
  predicate: () => true,
  effect: (action, listenerApi) => {
    console.log('action', action.type);
    console.log(listenerApi.getState());
  }
});

export const store = configureStore({
  reducer: {
    app: appReducer,
    collections: collectionsReducer,
    tabs: tabsReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware)
});

export default store;
