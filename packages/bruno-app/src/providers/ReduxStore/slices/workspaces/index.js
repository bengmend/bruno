import { createSlice } from "@reduxjs/toolkit";
import find from "lodash/find";
import map from "lodash/map";
import filter from "lodash/filter";
import { findCollectionInWorkspace } from "utils/workspaces";
import cache from "utils/common/cache";

const initialState = {
  workspaces: [],
  activeWorkspaceUid: null,
};

export const workspacesSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    loadWorkspaces: (state, action) => {
      state.workspaces = action.payload.workspaces;

      if (state.workspaces && state.workspaces.length) {
        const workspaceUids = map(state.workspaces, (w) => w.uid);
        const activeWorkspaceUid = cache.getActiveWorkspaceUid();
        if (activeWorkspaceUid && workspaceUids.includes(activeWorkspaceUid)) {
          state.activeWorkspaceUid = activeWorkspaceUid;
        } else {
          state.activeWorkspaceUid = state.workspaces[0].uid;
          cache.setActiveWorkspaceUid(state.activeWorkspaceUid);
        }
      }
    },
    selectWorkspace: (state, action) => {
      state.activeWorkspaceUid = action.payload.workspaceUid;
      cache.setActiveWorkspaceUid(state.activeWorkspaceUid);
    },
    renameWorkspace: (state, action) => {
      const { name, uid } = action.payload;
      const workspace = find(state.workspaces, (w) => w.uid === uid);

      if (workspace) {
        workspace.name = name;
      }
    },
    deleteWorkspace: (state, action) => {
      if (state.activeWorkspaceUid === action.payload.workspaceUid) {
        throw new Error("User cannot delete current workspace");
      }
      state.workspaces = state.workspaces.filter((workspace) => workspace.uid !== action.payload.workspaceUid);
    },
    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload.workspace);
    },
    addCollectionToWorkspace: (state, action) => {
      const { workspaceUid, collectionUid } = action.payload;
      const workspace = find(state.workspaces, (w) => w.uid === workspaceUid);

      if (workspace) {
        if (workspace.collections && workspace.collections.length) {
          if (!findCollectionInWorkspace(workspace, collectionUid)) {
            workspace.collections.push({
              uid: collectionUid,
            });
          }
        } else {
          workspace.collections = [
            {
              uid: collectionUid,
            },
          ];
        }
      }
    },
    removeCollectionFromWorkspace: (state, action) => {
      const { workspaceUid, collectionUid } = action.payload;
      const workspace = find(state.workspaces, (w) => w.uid === workspaceUid);

      if (workspace && workspace.collections && workspace.collections.length) {
        workspace.collections = filter(workspace.collections, (c) => c.uid !== collectionUid);
      }
    },
  },
});

export const { loadWorkspaces, selectWorkspace, renameWorkspace, deleteWorkspace, addWorkspace, addCollectionToWorkspace, removeCollectionFromWorkspace } = workspacesSlice.actions;

export default workspacesSlice.reducer;
