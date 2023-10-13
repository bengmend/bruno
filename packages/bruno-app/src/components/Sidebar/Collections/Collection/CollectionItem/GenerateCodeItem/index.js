import Modal from 'components/Modal/index';
import { useState } from 'react';
import CodeView from './CodeView';
import StyledWrapper from './StyledWrapper';
import { isValidUrl } from 'utils/url/index';
import { get, find } from 'lodash';
import handlebars from 'handlebars';
import { findEnvironmentInCollection } from 'utils/collections';

const interpolateUrl = ({ url, envVars, collectionVariables, processEnvVars }) => {
  if (!url || !url.length || typeof url !== 'string') {
    return;
  }

  const template = handlebars.compile(url, { noEscape: true });

  return template({
    ...envVars,
    ...collectionVariables,
    process: {
      env: {
        ...processEnvVars
      }
    }
  });
};

const joinPathUrl = (url, paths) => {
  let uri = url.slice();
  if (uri.indexOf('http') === -1 || uri.indexOf('https') === -1) {
    let [base, query = ''] = uri.split('?');

    let URL_SEPARATOR;

    uri = base.split('/').reduce((acc, path, index) => {
      if (index !== 0) {
        URL_SEPARATOR = '/';
      }
      if (path.charAt(0) !== ':') {
        acc += URL_SEPARATOR + path;
      } else {
        path = path.slice(1, path.length);
        const data = find(paths, (v) => v.name === path);
        if (data) {
          acc += URL_SEPARATOR + data.value;
        }
      }
      return acc;
    }, '');

    return uri + query;
  }
  uri = new URL(uri);
  let uriPaths = url.pathname.split('/');
  uriPaths = uriPaths.reduce((acc, path) => {
    if (path !== '') {
      if (path[0] !== ':') {
        acc += '/' + path;
      } else {
        let name = path.slice(1, path.length);
        if (name) {
          let existingPath = find(paths, (path) => path.name === name);
          if (existingPath) {
            acc += '/' + existingPath.value;
          }
        }
      }
    }
    return acc;
  }, '');

  return uri.origin + uriPaths + uri.search;
};

const languages = [
  {
    name: 'HTTP',
    target: 'http',
    client: 'http1.1'
  },
  {
    name: 'JavaScript-Fetch',
    target: 'javascript',
    client: 'fetch'
  },
  {
    name: 'Javascript-jQuery',
    target: 'javascript',
    client: 'jquery'
  },
  {
    name: 'Javascript-axios',
    target: 'javascript',
    client: 'axios'
  },
  {
    name: 'Python-Python3',
    target: 'python',
    client: 'python3'
  },
  {
    name: 'Python-Requests',
    target: 'python',
    client: 'requests'
  },
  {
    name: 'PHP',
    target: 'php',
    client: 'curl'
  },
  {
    name: 'Shell-curl',
    target: 'shell',
    client: 'curl'
  },
  {
    name: 'Shell-httpie',
    target: 'shell',
    client: 'httpie'
  }
];

const GenerateCodeItem = ({ collection, item, onClose }) => {
  const url = joinPathUrl(
    get(item, 'draft.request.url') !== undefined ? get(item, 'draft.request.url') : get(item, 'request.url'),
    get(item, 'draft.request.paths') !== undefined ? get(item, 'draft.request.paths') : get(item, 'request.paths')
  );
  const environment = findEnvironmentInCollection(collection, collection.activeEnvironmentUid);
  let envVars = {};
  if (environment) {
    const vars = get(environment, 'variables', []);
    envVars = vars.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});
  }

  const interpolatedUrl = interpolateUrl({
    url,
    envVars,
    collectionVariables: collection.collectionVariables,
    processEnvVars: collection.processEnvVariables
  });
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  return (
    <Modal size="lg" title="Generate Code" handleCancel={onClose} hideFooter={true}>
      <StyledWrapper>
        <div className="flex w-full">
          <div>
            <div className="generate-code-sidebar">
              {languages &&
                languages.length &&
                languages.map((language) => (
                  <div
                    key={language.name}
                    className={
                      language.name === selectedLanguage.name ? 'generate-code-item active' : 'generate-code-item'
                    }
                    onClick={() => setSelectedLanguage(language)}
                  >
                    <span className="capitalize">{language.name}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex-grow p-4">
            {isValidUrl(interpolatedUrl) ? (
              <CodeView
                language={selectedLanguage}
                item={{
                  ...item,
                  request:
                    item.request.url !== ''
                      ? {
                          ...item.request,
                          url: interpolatedUrl
                        }
                      : {
                          ...item.draft.request,
                          url: interpolatedUrl
                        }
                }}
              />
            ) : (
              <div className="flex flex-col justify-center items-center w-full">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">Invalid URL: {interpolatedUrl}</h1>
                  <p className="text-gray-500">Please check the URL and try again</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </StyledWrapper>
    </Modal>
  );
};

export default GenerateCodeItem;
