import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  localCollectionAddDirectoryEvent,
  localCollectionAddFileEvent,
  localCollectionChangeFileEvent,
  localCollectionUnlinkFileEvent,
  localCollectionUnlinkDirectoryEvent,
} from "providers/ReduxStore/slices/collections";
import toast from "react-hot-toast";
import { openLocalCollectionEvent, localCollectionLoadEnvironmentsEvent } from "providers/ReduxStore/slices/collections/actions";
import { isElectron } from "utils/common/platform";

const useLocalCollectionTreeSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isElectron()) {
      return () => {};
    }

    const { ipcRenderer } = window;

    const _openCollection = (pathname, uid, name) => {
      console.log(`collection uid: ${uid}, pathname: ${pathname}, name: ${name}`);
      dispatch(openLocalCollectionEvent(uid, pathname, name));
    };

    const _collectionTreeUpdated = (type, val) => {
      if (type === "addDir") {
        dispatch(
          localCollectionAddDirectoryEvent({
            dir: val,
          })
        );
      }
      if (type === "addFile") {
        dispatch(
          localCollectionAddFileEvent({
            file: val,
          })
        );
      }
      if (type === "change") {
        dispatch(
          localCollectionChangeFileEvent({
            file: val,
          })
        );
      }
      if (type === "unlink") {
        setTimeout(() => {
          dispatch(
            localCollectionUnlinkFileEvent({
              file: val,
            })
          );
        }, 100);
      }
      if (type === "unlinkDir") {
        dispatch(
          localCollectionUnlinkDirectoryEvent({
            directory: val,
          })
        );
      }
      if (type === "addEnvironmentFile") {
        dispatch(localCollectionLoadEnvironmentsEvent(val));
      }
      if (type === "changeEnvironmentFile") {
        dispatch(localCollectionLoadEnvironmentsEvent(val));
      }
    };

    const _collectionAlreadyOpened = (pathname) => {
      toast.success("Collection is already opened under local collections");
    };

    const _displayError = (message) => {
      toast.error(message || "Something went wrong!");
    };

    ipcRenderer.invoke("renderer:ready");

    const removeListener1 = ipcRenderer.on("main:collection-opened", _openCollection);
    const removeListener2 = ipcRenderer.on("main:collection-tree-updated", _collectionTreeUpdated);
    const removeListener3 = ipcRenderer.on("main:collection-already-opened", _collectionAlreadyOpened);
    const removeListener4 = ipcRenderer.on("main:display-error", _displayError);

    return () => {
      removeListener1();
      removeListener2();
      removeListener3();
      removeListener4();
    };
  }, [isElectron]);
};

export default useLocalCollectionTreeSync;
