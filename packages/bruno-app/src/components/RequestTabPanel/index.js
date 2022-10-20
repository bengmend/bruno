import React, { useState, useEffect } from "react";
import find from "lodash/find";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import GraphQLRequestPane from "components/RequestPane/GraphQLRequestPane";
import HttpRequestPane from "components/RequestPane/HttpRequestPane";
import ResponsePane from "components/ResponsePane";
import Welcome from "components/Welcome";
import { findItemInCollection } from "utils/collections";
import { updateRequestPaneTabWidth } from "providers/ReduxStore/slices/tabs";
import { sendRequest } from "providers/ReduxStore/slices/collections/actions";
import RequestNotFound from "./RequestNotFound";
import QueryUrl from "components/RequestPane/QueryUrl";
import NetworkError from "components/ResponsePane/NetworkError";
import useGraphqlSchema from "../../hooks/useGraphqlSchema";

import StyledWrapper from "./StyledWrapper";

const RequestTabPanel = () => {
  if (typeof window == "undefined") {
    return <div></div>;
  }
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabs.tabs);
  const activeTabUid = useSelector((state) => state.tabs.activeTabUid);
  const collections = useSelector((state) => state.collections.collections);
  const screenWidth = useSelector((state) => state.app.screenWidth);

  let asideWidth = useSelector((state) => state.app.leftSidebarWidth);
  const focusedTab = find(tabs, (t) => t.uid === activeTabUid);
  const [leftPaneWidth, setLeftPaneWidth] = useState(focusedTab && focusedTab.requestPaneWidth ? focusedTab.requestPaneWidth : (screenWidth - asideWidth) / 2.2); // 2.2 so that request pane is relatively smaller
  const [rightPaneWidth, setRightPaneWidth] = useState(screenWidth - asideWidth - leftPaneWidth - 5);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const leftPaneWidth = (screenWidth - asideWidth) / 2.2;
    setLeftPaneWidth(leftPaneWidth);
  }, [screenWidth]);

  useEffect(() => {
    setRightPaneWidth(screenWidth - asideWidth - leftPaneWidth - 5);
  }, [screenWidth, asideWidth, leftPaneWidth]);

  const handleMouseMove = (e) => {
    if (dragging) {
      e.preventDefault();
      setLeftPaneWidth(e.clientX - asideWidth - 5);
      setRightPaneWidth(screenWidth - e.clientX - 5);
    }
  };
  const handleMouseUp = (e) => {
    if (dragging) {
      e.preventDefault();
      setDragging(false);
      dispatch(
        updateRequestPaneTabWidth({
          uid: activeTabUid,
          requestPaneWidth: e.clientX - asideWidth - 5,
        })
      );
    }
  };
  const handleDragbarMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  let schema = null;
  // let {
  //   schema
  // } = useGraphqlSchema('https://api.spacex.land/graphql');

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [dragging, asideWidth]);

  if (!activeTabUid) {
    return <Welcome />;
  }

  if (!focusedTab || !focusedTab.uid || !focusedTab.collectionUid) {
    return <div className="pb-4 px-4">An error occured!</div>;
  }

  let collection = find(collections, (c) => c.uid === focusedTab.collectionUid);
  if (!collection || !collection.uid) {
    return <div className="pb-4 px-4">Collection not found!</div>;
  }

  const item = findItemInCollection(collection, activeTabUid);
  if (!item || !item.uid) {
    return <RequestNotFound itemUid={activeTabUid} />;
  }

  const handleRun = async () => {
    dispatch(sendRequest(item, collection.uid)).catch((err) =>
      toast.custom((t) => <NetworkError onClose={() => toast.dismiss(t.id)} />, {
        duration: 5000,
      })
    );
  };
  const onGraphqlQueryChange = (value) => {};
  const runQuery = async () => {};

  return (
    <StyledWrapper className={`flex flex-col flex-grow ${dragging ? "dragging" : ""}`}>
      <div className="pt-4 pb-3 px-4">
        <QueryUrl item={item} collection={collection} handleRun={handleRun} />
      </div>
      <section className="main flex flex-grow pb-4">
        <section className="request-pane">
          <div className="px-4" style={{ width: `${leftPaneWidth}px`, height: "calc(100% - 5px)" }}>
            {item.type === "graphql-request" ? (
              <GraphQLRequestPane
                onRunQuery={runQuery}
                schema={schema}
                leftPaneWidth={leftPaneWidth}
                value={item.request.body.graphql.query}
                onQueryChange={onGraphqlQueryChange}
              />
            ) : null}

            {item.type === "http-request" ? <HttpRequestPane item={item} collection={collection} leftPaneWidth={leftPaneWidth} /> : null}
          </div>
        </section>

        <div className="drag-request" onMouseDown={handleDragbarMouseDown}>
          <div className="drag-request-border" />
        </div>

        <section className="response-pane flex-grow">
          <ResponsePane item={item} collection={collection} rightPaneWidth={rightPaneWidth} response={item.response} />
        </section>
      </section>
    </StyledWrapper>
  );
};

export default RequestTabPanel;
