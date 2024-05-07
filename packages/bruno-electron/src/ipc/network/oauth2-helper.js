const { get, cloneDeep } = require('lodash');
const crypto = require('crypto');
const { authorizeUserInWindow, authorizeUserInWindowImplicit } = require('./authorize-user-in-window');
const Oauth2Store = require('../../store/oauth2');
const { makeAxiosInstance } = require('./axios-instance');

const oauth2Store = new Oauth2Store();

const setClientCredentials = (clientId, clientSecret, clientSecretMethod, request) => {
  let credentialsInBody;
  let credentialsInHeader;
  if (clientSecret) {
    switch (clientSecretMethod) {
      case 'client_credentials_post': {
        credentialsInBody = {
          client_secret: clientSecret,
          client_id: clientId
        };
        request.data = { ...request.data, ...credentialsInBody };
        break;
      }
      case 'client_credentials_basic': {
        const credentials = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');
        credentialsInHeader = { Authorization: credentials };
        request.headers = { ...request.headers, ...credentialsInHeader };
        break;
      }
    }
  }
};

const generateCodeVerifier = () => {
  return crypto.randomBytes(22).toString('hex');
};

const generateCodeChallenge = (codeVerifier) => {
  const hash = crypto.createHash('sha256');
  hash.update(codeVerifier);
  const base64Hash = hash.digest('base64');
  return base64Hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const getPersistedOauth2Credentials = (collectionUid) => {
  const collectionOauthStore = oauth2Store.getOauth2DataOfCollection(collectionUid);
  const cachedCredentials = collectionOauthStore.credentials;
  return { cachedCredentials };
};

const persistOauth2Credentials = (credentials, collectionUid) => {
  const collectionOauthStore = oauth2Store.getOauth2DataOfCollection(collectionUid);
  collectionOauthStore.credentials = credentials;
  oauth2Store.updateOauth2DataOfCollection(collectionUid, collectionOauthStore);
};

// AUTHORIZATION CODE

const oauth2AuthorizeWithAuthorizationCode = async (request, collectionUid) => {
  const { cachedCredentials } = getPersistedOauth2Credentials(collectionUid);
  if (cachedCredentials?.access_token) {
    console.log('Reusing Stored access token');
    return { credentials: cachedCredentials, response: {} };
  }

  let codeVerifier = generateCodeVerifier();
  let codeChallenge = generateCodeChallenge(codeVerifier);

  let requestCopy = cloneDeep(request);
  const { authorizationCode } = await getOAuth2AuthorizationCode(requestCopy, codeChallenge, collectionUid);
  const oAuth = get(requestCopy, 'oauth2', {});
  const { clientId, clientSecret, clientSecretMethod, callbackUrl, scope, pkce } = oAuth;

  const data = {
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: callbackUrl,
    scope: scope
  };
  if (pkce) {
    data['code_verifier'] = codeVerifier;
  }

  request.method = 'POST';
  request.headers['content-type'] = 'application/x-www-form-urlencoded';
  request.data = data;
  request.url = request?.oauth2?.accessTokenUrl;

  setClientCredentials(clientId, clientSecret, clientSecretMethod, request);

  const axiosInstance = makeAxiosInstance();
  const response = await axiosInstance(request);
  const credentials = JSON.parse(response.data);
  persistOauth2Credentials(credentials, collectionUid);
  return { credentials, response };
};

const getOAuth2AuthorizationCode = (request, codeChallenge, collectionUid) => {
  return new Promise(async (resolve, reject) => {
    const { oauth2 } = request;
    const { callbackUrl, clientId, authorizationUrl, scope, pkce } = oauth2;

    let oauth2QueryParams =
      (authorizationUrl.indexOf('?') > -1 ? '&' : '?') + `client_id=${clientId}&response_type=code`;
    if (callbackUrl) {
      oauth2QueryParams += `&redirect_uri=${callbackUrl}`;
    }
    if (scope) {
      oauth2QueryParams += `&scope=${scope}`;
    }
    if (pkce) {
      oauth2QueryParams += `&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    }
    const authorizationUrlWithQueryParams = authorizationUrl + oauth2QueryParams;
    try {
      const { authorizationCode } = await authorizeUserInWindow({
        authorizeUrl: authorizationUrlWithQueryParams,
        callbackUrl,
        session: oauth2Store.getSessionIdOfCollection(collectionUid)
      });
      resolve({ authorizationCode });
    } catch (err) {
      reject(err);
    }
  });
};

// CLIENT CREDENTIALS

const oauth2AuthorizeWithClientCredentials = async (request, collectionUid) => {
  const { cachedCredentials } = getPersistedOauth2Credentials(collectionUid);
  if (cachedCredentials?.access_token) {
    console.log('Reusing Stored access token');
    return { credentials: cachedCredentials, response: {} };
  }

  let requestCopy = cloneDeep(request);
  const oAuth = get(requestCopy, 'oauth2', {});
  const { clientId, clientSecret, clientSecretMethod, scope } = oAuth;
  const data = {
    grant_type: 'client_credentials',
    scope
  };
  request.method = 'POST';
  request.headers['content-type'] = 'application/x-www-form-urlencoded';
  request.data = data;
  request.url = request?.oauth2?.accessTokenUrl;

  setClientCredentials(clientId, clientSecret, clientSecretMethod, request);

  const axiosInstance = makeAxiosInstance();
  let response = await axiosInstance(request);
  let credentials = JSON.parse(response.data);
  persistOauth2Credentials(credentials, collectionUid);
  return { credentials, response };
};

// PASSWORD CREDENTIALS

const oauth2AuthorizeWithPasswordCredentials = async (request, collectionUid) => {
  const { cachedCredentials } = getPersistedOauth2Credentials(collectionUid);
  if (cachedCredentials?.access_token) {
    console.log('Reusing Stored access token');
    return { credentials: cachedCredentials, response: {} };
  }

  const oAuth = get(request, 'oauth2', {});
  const { username, password, clientId, clientSecret, clientSecretMethod, scope } = oAuth;
  const data = {
    grant_type: 'password',
    username,
    password,
    scope
  };
  request.method = 'POST';
  request.headers['content-type'] = 'application/x-www-form-urlencoded';
  request.data = data;
  request.url = request?.oauth2?.accessTokenUrl;

  setClientCredentials(clientId, clientSecret, clientSecretMethod, request);

  const axiosInstance = makeAxiosInstance();
  let response = await axiosInstance(request);
  let credentials = JSON.parse(response.data);
  persistOauth2Credentials(credentials, collectionUid);
  return { credentials, response };
};

// IMPLICIT

const oauth2AuthorizeWithImplicitFlow = async (request, collectionUid) => {
  const { cachedCredentials } = getPersistedOauth2Credentials(collectionUid);
  if (cachedCredentials?.access_token) {
    console.log('Reusing Stored access token');
    return { credentials: cachedCredentials, response: {} };
  }

  return new Promise(async (resolve, reject) => {
    const { oauth2 } = request;
    const { callbackUrl, authorizationUrl, clientId, scope } = oauth2;
    let oauth2QueryParams =
      (authorizationUrl.indexOf('?') > -1 ? '&' : '?') + `client_id=${clientId}&response_type=token`;
    if (callbackUrl) {
      oauth2QueryParams += `&redirect_uri=${callbackUrl}`;
    }
    if (scope) {
      oauth2QueryParams += `&scope=${scope}`;
    }
    const authorizationUrlWithQueryParams = authorizationUrl + oauth2QueryParams;
    try {
      const { credentials } = await authorizeUserInWindowImplicit({
        authorizeUrl: authorizationUrlWithQueryParams,
        callbackUrl: callbackUrl,
        session: oauth2Store.getSessionIdOfCollection(collectionUid)
      });
      resolve({ credentials, response: {} });
      persistOauth2Credentials(credentials, collectionUid);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  oauth2AuthorizeWithAuthorizationCode,
  oauth2AuthorizeWithClientCredentials,
  oauth2AuthorizeWithPasswordCredentials,
  oauth2AuthorizeWithImplicitFlow
};
