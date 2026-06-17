import { type DocumentLoader, getJsonLdDocLoader } from './loaders/jsonld-loader';
import { DEFAULT_HASHER } from './poseidon';
import type { Hasher, Options } from './types/types';

export function getHasher(opts?: Options): Hasher {
  return opts?.hasher ?? DEFAULT_HASHER;
}

export function getDocumentLoader(opts?: Options): DocumentLoader {
  return opts?.documentLoader ?? getJsonLdDocLoader(opts?.ipfsNodeURL, opts?.ipfsGatewayURL);
}
