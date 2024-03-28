import { RequestContext } from '../types';

function applyCollectionHeader(context: RequestContext) {
  const mergedHeaders = [...context.collection.request.headers, ...context.requestItem.request.headers];

  context.debug.log('applyCollectionHeader', {
    collectionHeaders: context.collection.request.headers,
    requestHeaders: context.requestItem.request.headers,
    mergedHeaders
  });

  context.requestItem.request.headers = mergedHeaders;
}

function applyCollectionAuth(context: RequestContext) {
  if (context.requestItem.request.auth.mode !== 'inherit') {
    context.debug.log('applyCollectionHeader', {
      requestMode: context.requestItem.request.auth.mode,
      collectionMode: context.collection.request.auth.mode,
      finalAuth: context.requestItem.request.auth,
      skipped: true
    });
    return;
  }

  context.requestItem.request.auth = context.collection.request.auth;

  context.debug.log('applyCollectionHeader', {
    requestMode: 'inherit', // Its always inherit at this point
    collectionMode: context.requestItem.request.auth.mode,
    finalAuth: context.requestItem.request.auth,
    skipped: false
  });
}

export function applyCollectionSettings(context: RequestContext) {
  applyCollectionHeader(context);
  applyCollectionAuth(context);
}
