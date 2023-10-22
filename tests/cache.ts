import { RemoteDocument } from 'jsonld/jsonld-spec';
import { getDocumentLoader } from '../src/lib/options';
import { Options } from '../src/lib/types/types';
import { W3C_CREDENTIAL_2018, W3C_VC_SCHEMA } from './data';
import { DocumentLoader } from '../src/loaders/jsonld-loader';

const cache = new Map<string, RemoteDocument>();
cache.set(W3C_CREDENTIAL_2018, {
  document: W3C_VC_SCHEMA,
  documentUrl: W3C_CREDENTIAL_2018
});
export const cacheLoader = (opts?: Options): DocumentLoader => {
  return async (url): Promise<RemoteDocument> => {
    let remoteDoc = cache.get(url);
    if (remoteDoc) {
      return remoteDoc;
    }
    remoteDoc = await getDocumentLoader(opts)(url);
    cache.set(url, remoteDoc);
    return remoteDoc;
  };
};
