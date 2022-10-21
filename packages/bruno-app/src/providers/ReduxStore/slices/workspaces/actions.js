import find from 'lodash/find';
import filter from 'lodash/filter';
import { uuid } from 'utils/common';
import cloneDeep from 'lodash/cloneDeep';
import { workspaceSchema } from '@usebruno/schema';
import { findCollectionInWorkspace } from 'utils/workspaces';
import { getWorkspacesFromIdb, saveWorkspaceToIdb, deleteWorkspaceInIdb } from 'utils/idb/workspaces';
import { BrunoError } from 'utils/common/error';
import {
  loadWorkspaces,
  addWorkspace as _addWorkspace,
  renameWorkspace as _renameWorkspace,
  deleteWorkspace as _deleteWorkspace,
  addCollectionToWorkspace as _addCollectionToWorkspace,
  removeCollectionFromWorkspace as _removeCollectionFromWorkspace
} from './index';

const seedWorkpace = () => {
  const uid = uuid();
  const workspace = {
    uid: uid,
    name: 'My workspace',
    collections: []
  };

  return new Promise((resolve, reject) => {
    workspaceSchema
      .validate(workspace)
      .then(() => saveWorkspaceToIdb(window.__idb, workspace))
      .then(() => resolve([workspace]))
      .catch(reject);
  });
};

export const loadWorkspacesFromIdb = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    getWorkspacesFromIdb(window.__idb)
      .then((workspaces) => {
        if (!workspaces || !workspaces.length) {
          return seedWorkpace();
        }

        return workspaces;
      })
      .then((workspaces) =>
        dispatch(
          loadWorkspaces({
            workspaces: workspaces
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

export const addWorkspace = (workspaceName) => (dispatch) => {
  const newWorkspace = {
    uid: uuid(),
    name: workspaceName,
    collections: []
  };

  return new Promise((resolve, reject) => {
    workspaceSchema
      .validate(newWorkspace)
      .then(() => saveWorkspaceToIdb(window.__idb, newWorkspace))
      .then(() =>
        dispatch(
          _addWorkspace({
            workspace: newWorkspace
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

export const renameWorkspace = (newName, uid) => (dispatch, getState) => {
  const state = getState();

  return new Promise((resolve, reject) => {
    const workspace = find(state.workspaces.workspaces, (w) => w.uid === uid);

    if (!workspace) {
      return reject(new Error('Workspace not found'));
    }

    const workspaceCopy = cloneDeep(workspace);
    workspaceCopy.name = newName;

    workspaceSchema
      .validate(workspaceCopy)
      .then(() => saveWorkspaceToIdb(window.__idb, workspaceCopy))
      .then(() =>
        dispatch(
          _renameWorkspace({
            uid: uid,
            name: newName
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

export const deleteWorkspace = (workspaceUid) => (dispatch, getState) => {
  const state = getState();

  return new Promise((resolve, reject) => {
    if (state.workspaces.activeWorkspaceUid === workspaceUid) {
      throw new BrunoError('Cannot delete current workspace');
    }

    const workspace = find(state.workspaces.workspaces, (w) => w.uid === workspaceUid);

    if (!workspace) {
      return reject(new Error('Workspace not found'));
    }

    deleteWorkspaceInIdb(window.__idb, workspaceUid)
      .then(() =>
        dispatch(
          _deleteWorkspace({
            workspaceUid: workspaceUid
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

export const addCollectionToWorkspace = (workspaceUid, collectionUid) => (dispatch, getState) => {
  const state = getState();

  return new Promise((resolve, reject) => {
    const workspace = find(state.workspaces.workspaces, (w) => w.uid === workspaceUid);
    const collection = find(state.collections.collections, (c) => c.uid === collectionUid);

    if (!workspace) {
      return reject(new Error('Workspace not found'));
    }

    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const workspaceCopy = cloneDeep(workspace);
    if (workspaceCopy.collections && workspace.collections.length) {
      if (!findCollectionInWorkspace(workspace, collectionUid)) {
        workspaceCopy.collections.push({
          uid: collectionUid
        });
      }
    } else {
      workspaceCopy.collections = [
        {
          uid: collectionUid
        }
      ];
    }

    workspaceSchema
      .validate(workspaceCopy)
      .then(() => saveWorkspaceToIdb(window.__idb, workspaceCopy))
      .then(() =>
        dispatch(
          _addCollectionToWorkspace({
            workspaceUid: workspaceUid,
            collectionUid: collectionUid
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

export const removeCollectionFromWorkspace = (workspaceUid, collectionUid) => (dispatch, getState) => {
  const state = getState();

  return new Promise((resolve, reject) => {
    const workspace = find(state.workspaces.workspaces, (w) => w.uid === workspaceUid);
    const collection = find(state.collections.collections, (c) => c.uid === collectionUid);

    if (!workspace) {
      return reject(new Error('Workspace not found'));
    }

    if (!collection) {
      return reject(new Error('Collection not found'));
    }

    const workspaceCopy = cloneDeep(workspace);
    if (workspaceCopy.collections && workspace.collections.length) {
      workspaceCopy.collections = filter(workspaceCopy.collections, (c) => c.uid !== collectionUid);
    }

    workspaceSchema
      .validate(workspaceCopy)
      .then(() => saveWorkspaceToIdb(window.__idb, workspaceCopy))
      .then(() =>
        dispatch(
          _removeCollectionFromWorkspace({
            workspaceUid: workspaceUid,
            collectionUid: collectionUid
          })
        )
      )
      .then(resolve)
      .catch(reject);
  });
};

// TODO
// Workspaces can have collection uids that no longer exist
// or the user may have the collections access revoked (in teams)
// This action will have to be called at the beginning to purge any zombi collection references in the workspaces
export const removeZombieCollectionFromAllWorkspaces = (workspaceUid) => (dispatch, getState) => {};
