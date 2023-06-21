import { Hasher, Options } from './types/types';
import { DEFAULT_HASHER } from './poseidon';
import { getJsonLdDocLoader, LoadDocumentCallback } from '../loaders/jsonld-loader';

export function getHasher(opts?: Options): Hasher {
  return opts?.hasher ?? DEFAULT_HASHER;
}

export function getDocumentLoader(opts?: Options): LoadDocumentCallback {
  if (typeof opts === 'undefined' || opts === null) {
    return getJsonLdDocLoader();
  }

  if (typeof opts.documentLoader !== 'undefined' && opts.documentLoader !== null) {
    return opts.documentLoader;
  }

  const ipfsNodeURL = opts?.ipfsNodeURL ?? null;
  const ipfsGatewayURL = opts?.ipfsGatewayURL ?? null;
  return getJsonLdDocLoader(ipfsNodeURL, ipfsGatewayURL);
}
