import { InMemoryDB, str2Bytes, Merkletree } from '@iden3/js-merkletree';
import { RDFEntry } from './rdf-entry';

export const getMerkleTreeInitParam = (
  prefix = '',
  writable = true,
  maxLevels = 40
): {
  db: InMemoryDB;
  writable: boolean;
  maxLevels: number;
} => {
  return {
    db: new InMemoryDB(str2Bytes(prefix)),
    writable,
    maxLevels
  };
};

export const addEntriesToMerkleTree = async (
  mt: Merkletree,
  entries: RDFEntry[]
): Promise<void> => {
  for (const e of entries) {
    const { k, v } = await e.getKeyValueMTEntry();
    await mt.add(k, v);
  }
};
