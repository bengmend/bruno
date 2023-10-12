import React from 'react';
import get from 'lodash/get';
import { useDispatch } from 'react-redux';
import { useTheme } from 'providers/Theme';
import { setRequestFile } from 'providers/ReduxStore/slices/collections';
import { browseFile } from 'providers/ReduxStore/slices/collections/actions';
import StyledWrapper from './StyledWrapper';

const FileBody = ({ item, collection }) => {
  const dispatch = useDispatch();
  const file = item.draft ? get(item, 'draft.request.body.file') : get(item, 'request.body.file');

  const setFile = (filePath) => {
    dispatch(
      setRequestFile({
        itemUid: item.uid,
        collectionUid: collection.uid,
        file: filePath
      })
    );
  };

  const browse = () => {
    dispatch(browseFile())
      .then((filePath) => {
        // When the user closes the diolog without selecting anything dirPath will be false
        if (typeof filePath === 'string') {
          setFile(filePath);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <StyledWrapper className="w-full">
      <button className="btn btn-secondary" onClick={browse}>
        {file || 'Set File'}
      </button>
    </StyledWrapper>
  );
};
export default FileBody;
