import React from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import toast from 'react-hot-toast';
import { updateBrunoConfig } from 'providers/ReduxStore/slices/collections/actions';
import { updateSettingsSelectedTab } from 'providers/ReduxStore/slices/collections';
import { useDispatch } from 'react-redux';
import ProxySettings from './ProxySettings';
import Headers from './Headers';
import Auth from './Auth';
import Script from './Script';
import Test from './Tests';
import StyledWrapper from './StyledWrapper';

const CollectionSettings = ({ collection }) => {
  const dispatch = useDispatch();
  const tab = collection.settingsSelectedTab;
  const setTab = (tab) => {
    dispatch(
      updateSettingsSelectedTab({
        collectionUid: collection.uid,
        tab
      })
    );
  };

  const proxyConfig = get(collection, 'brunoConfig.proxy', {});

  const onProxySettingsUpdate = (config) => {
    const brunoConfig = cloneDeep(collection.brunoConfig);
    brunoConfig.proxy = config;
    dispatch(updateBrunoConfig(brunoConfig, collection.uid))
      .then(() => {
        toast.success('Collection settings updated successfully');
      })
      .catch((err) => console.log(err) && toast.error('Failed to update collection settings'));
  };

  const getTabPanel = (tab) => {
    switch (tab) {
      case 'headers': {
        return <Headers collection={collection} />;
      }
      case 'auth': {
        return <Auth collection={collection} />;
      }
      case 'script': {
        return <Script collection={collection} />;
      }
      case 'tests': {
        return <Test collection={collection} />;
      }
      case 'proxy': {
        return <ProxySettings proxyConfig={proxyConfig} onUpdate={onProxySettingsUpdate} />;
      }
    }
  };

  const getTabClassname = (tabName) => {
    return classnames(`tab select-none ${tabName}`, {
      active: tabName === tab
    });
  };

  return (
    <StyledWrapper className="flex flex-col h-full relative px-4 py-4">
      <div className="flex flex-wrap items-center tabs" role="tablist">
        <div className={getTabClassname('headers')} role="tab" onClick={() => setTab('headers')}>
          Headers
        </div>
        <div className={getTabClassname('auth')} role="tab" onClick={() => setTab('auth')}>
          Auth
        </div>
        <div className={getTabClassname('script')} role="tab" onClick={() => setTab('script')}>
          Script
        </div>
        <div className={getTabClassname('tests')} role="tab" onClick={() => setTab('tests')}>
          Tests
        </div>
        <div className={getTabClassname('proxy')} role="tab" onClick={() => setTab('proxy')}>
          Proxy
        </div>
      </div>
      <section className={`flex ${['auth', 'script'].includes(tab) ? '' : 'mt-4'}`}>{getTabPanel(tab)}</section>
    </StyledWrapper>
  );
};

export default CollectionSettings;
