import { Hasher, MerklizerOptions } from './types/types';
import { DEFAULT_HASHER } from './poseidon';
import { getJsonLdDocLoader, DocumentLoader } from '../loaders/jsonld-loader';

export function getHasher(opts?: MerklizerOptions): Hasher {
  return opts?.hasher ?? DEFAULT_HASHER;
}

export function getDocumentLoader(opts?: MerklizerOptions): DocumentLoader {
  const ipfsNodeURL = opts?.ipfsNodeURL ?? null;
  const ipfsGatewayURL = opts?.ipfsGatewayURL ?? null;
  return opts?.documentLoader ?? getJsonLdDocLoader(ipfsNodeURL, ipfsGatewayURL);
}
