import React from "react";
import find from "lodash/find";
import classnames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { updateRequestPaneTab } from "providers/ReduxStore/slices/tabs";
import QueryParams from "components/RequestPane/QueryParams";
import RequestHeaders from "components/RequestPane/RequestHeaders";
import RequestBody from "components/RequestPane/RequestBody";
import RequestBodyMode from "components/RequestPane/RequestBody/RequestBodyMode";
import StyledWrapper from "./StyledWrapper";

const HttpRequestPane = ({ item, collection, leftPaneWidth }) => {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabs.tabs);
  const activeTabUid = useSelector((state) => state.tabs.activeTabUid);

  const selectTab = (tab) => {
    dispatch(
      updateRequestPaneTab({
        uid: item.uid,
        requestPaneTab: tab,
      })
    );
  };

  const getTabPanel = (tab) => {
    switch (tab) {
      case "params": {
        return <QueryParams item={item} collection={collection} />;
      }
      case "body": {
        return <RequestBody item={item} collection={collection} />;
      }
      case "headers": {
        return <RequestHeaders item={item} collection={collection} />;
      }
      default: {
        return <div className="mt-4">404 | Not found</div>;
      }
    }
  };

  if (!activeTabUid) {
    return <div>Something went wrong</div>;
  }

  const focusedTab = find(tabs, (t) => t.uid === activeTabUid);
  if (!focusedTab || !focusedTab.uid || !focusedTab.requestPaneTab) {
    return <div className="pb-4 px-4">An error occured!</div>;
  }

  const getTabClassname = (tabName) => {
    return classnames(`tab select-none ${tabName}`, {
      active: tabName === focusedTab.requestPaneTab,
    });
  };

  return (
    <StyledWrapper className="flex flex-col h-full relative">
      <div className="flex items-center tabs" role="tablist">
        <div className={getTabClassname("params")} role="tab" onClick={() => selectTab("params")}>
          Params
        </div>
        <div className={getTabClassname("body")} role="tab" onClick={() => selectTab("body")}>
          Body
        </div>
        <div className={getTabClassname("headers")} role="tab" onClick={() => selectTab("headers")}>
          Headers
        </div>
        {/* Moved to post mvp */}
        {/* <div className={getTabClassname('auth')} role="tab" onClick={() => selectTab('auth')}>Auth</div> */}
        {focusedTab.requestPaneTab === "body" ? (
          <div className="flex flex-grow justify-end items-center">
            <RequestBodyMode item={item} collection={collection} />
          </div>
        ) : null}
      </div>
      <section className="flex w-full mt-5">{getTabPanel(focusedTab.requestPaneTab)}</section>
    </StyledWrapper>
  );
};

export default HttpRequestPane;
