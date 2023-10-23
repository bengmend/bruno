import React from 'react';
import get from 'lodash/get';
import { useDispatch, useSelector } from 'react-redux';
import CodeEditor from 'components/CodeEditor';
import { updateRequestScript, updateResponseScript } from 'providers/ReduxStore/slices/collections';
import { sendRequest, saveRequest } from 'providers/ReduxStore/slices/collections/actions';
import { useTheme } from 'providers/Theme';
import StyledWrapper from './StyledWrapper';
import PaneContent from '../PaneContent/index';

const Script = ({ item, collection }) => {
  const dispatch = useDispatch();
  const requestScript = item.draft ? get(item, 'draft.request.script.req') : get(item, 'request.script.req');
  const responseScript = item.draft ? get(item, 'draft.request.script.res') : get(item, 'request.script.res');

  const { storedTheme } = useTheme();
  const preferences = useSelector((state) => state.app.preferences);

  const onRequestScriptEdit = (value) => {
    dispatch(
      updateRequestScript({
        script: value,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const onResponseScriptEdit = (value) => {
    dispatch(
      updateResponseScript({
        script: value,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const onRun = () => dispatch(sendRequest(item, collection.uid));
  const onSave = () => dispatch(saveRequest(item.uid, collection.uid));

  return (
    <PaneContent>
      <StyledWrapper className="w-full flex flex-col">
        <div className="flex-1">
          <div className="mb-1 title text-xs">Pre Request</div>
          <CodeEditor
            collection={collection}
            value={requestScript || ''}
            theme={storedTheme}
            font={get(preferences, 'font.codeFont', 'default')}
            onEdit={onRequestScriptEdit}
            mode="javascript"
            onRun={onRun}
            onSave={onSave}
          />
        </div>
        <div className="flex-1 mt-6">
          <div className="mt-1 mb-1 title text-xs">Post Response</div>
          <CodeEditor
            collection={collection}
            value={responseScript || ''}
            theme={storedTheme}
            font={get(preferences, 'font.codeFont', 'default')}
            onEdit={onResponseScriptEdit}
            mode="javascript"
            onRun={onRun}
            onSave={onSave}
          />
        </div>
      </StyledWrapper>
    </PaneContent>
  );
};

export default Script;
