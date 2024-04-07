import React from 'react';
import get from 'lodash/get';
import { useDispatch } from 'react-redux';
import AuthMode from './AuthMode';
import AwsV4Auth from './AwsV4Auth';
import BearerAuth from './BearerAuth';
import BasicAuth from './BasicAuth';
import DigestAuth from './DigestAuth';
import { saveCollectionRoot } from 'providers/ReduxStore/slices/collections/actions';
import StyledWrapper from './StyledWrapper';
import OAuth2 from './OAuth2';

const Auth = ({ collection }) => {
  const authMode = get(collection, 'root.request.auth.mode');
  const dispatch = useDispatch();

  const handleSave = () => dispatch(saveCollectionRoot(collection.uid));

  const getAuthView = () => {
    switch (authMode) {
      case 'awsv4': {
        return <AwsV4Auth collection={collection} />;
      }
      case 'basic': {
        return <BasicAuth collection={collection} />;
      }
      case 'bearer': {
        return <BearerAuth collection={collection} />;
      }
      case 'digest': {
        return <DigestAuth collection={collection} />;
      }
      case 'oauth2': {
        return <OAuth2 collection={collection} />;
      }
    }
  };

  return (
    <StyledWrapper className="w-full h-full">
      <div className="text-sm mb-6">
        Configures authentication for the entire collection. This applies to all requests using the 'Inherit' option in
        the 'Auth' tab, as well as any new requests added to this collection.
      </div>
      <div className="flex flex-grow justify-start items-center">
        <AuthMode collection={collection} />
      </div>
      {getAuthView()}
      <div className="mt-6">
        <button type="submit" className="submit btn btn-sm btn-secondary" onClick={handleSave}>
          Save
        </button>
      </div>
    </StyledWrapper>
  );
};
export default Auth;
