import { Hasher, Options } from './types/types';
import { DEFAULT_HASHER } from './poseidon';
import { getJsonLdDocLoader, DocumentLoader } from '../loaders/jsonld-loader';

export function getHasher(opts?: Options): Hasher {
  return opts?.hasher ?? DEFAULT_HASHER;
}

export function getDocumentLoader(opts?: Options): DocumentLoader {
  return opts?.documentLoader ?? getJsonLdDocLoader(opts?.ipfsNodeURL, opts?.ipfsGatewayURL);
}
