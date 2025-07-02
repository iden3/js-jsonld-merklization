import { poseidon } from '@iden3/js-crypto';
import { Hasher } from '../src/types/types';

export class TestHasher implements Hasher {
  async hash(inpBI: bigint[]): Promise<bigint> {
    return poseidon.hash(inpBI);
  }

  async hashBytes(msg: Uint8Array): Promise<bigint> {
    return poseidon.hashBytesX(msg, 6);
  }

  prime(): bigint {
    return BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617');
  }
}
