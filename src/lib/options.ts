import { Hasher, Options } from './types/types';
import { DEFAULT_HASHER } from './poseidon';
import { getJsonLdDocLoader, DocumentLoader } from '../loaders/jsonld-loader';

export function getHasher(opts?: Options): Hasher {
  return opts?.hasher ?? DEFAULT_HASHER;
}

export function getDocumentLoader(opts?: Options): DocumentLoader {
  const ipfsNodeURL = opts?.ipfsNodeURL ?? null;
  const ipfsGatewayURL = opts?.ipfsGatewayURL ?? null;
  return opts?.documentLoader ?? getJsonLdDocLoader(ipfsNodeURL, ipfsGatewayURL);
}
