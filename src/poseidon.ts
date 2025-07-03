import { MerklizationConstants } from './constants';
import { poseidon } from '@iden3/js-crypto';
import { Hasher } from './types/types';

export class PoseidonHasher implements Hasher {
  constructor(private readonly _hasher = poseidon) {}

  async hash(inp: bigint[]): Promise<bigint> {
    return this._hasher.hash(inp);
  }

  async hashBytes(b: Uint8Array): Promise<bigint> {
    return this._hasher.hashBytes(b);
  }

  prime(): bigint {
    return MerklizationConstants.Q;
  }
}

export const DEFAULT_HASHER = new PoseidonHasher();
