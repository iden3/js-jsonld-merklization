import { MerklizationConstants } from './constants';
import { Hasher } from './types/types';
import { Value } from './types/types';
import { DEFAULT_HASHER } from './poseidon';

const bytesEncoder = new TextEncoder();

export class MtValue {
  constructor(public readonly value: Value, private readonly h: Hasher = DEFAULT_HASHER) {}

  isString(): boolean {
    return typeof this.value === 'string';
  }

  asString(): string {
    if (!this.isString()) {
      throw MerklizationConstants.ERRORS.MT_VALUE_INCORRECT_TYPE;
    }
    return this.value.toString();
  }

  isTime(): boolean {
    return this.value instanceof Date;
  }

  asTime(): Date {
    if (!this.isTime()) {
      throw MerklizationConstants.ERRORS.MT_VALUE_INCORRECT_TYPE;
    }
    return this.value as Date;
  }

  isNumber(): boolean {
    return typeof this.value === 'number';
  }

  asNumber(): number {
    if (!this.isNumber()) {
      throw MerklizationConstants.ERRORS.MT_VALUE_INCORRECT_TYPE;
    }
    return this.value as number;
  }

  isBool(): boolean {
    return typeof this.value === 'boolean';
  }

  asBool(): boolean {
    if (!this.isBool()) {
      throw MerklizationConstants.ERRORS.MT_VALUE_INCORRECT_TYPE;
    }
    return this.value as boolean;
  }

  mtEntry(): Promise<bigint> {
    return MtValue.mkValueMtEntry(this.h, this.value);
  }

  static mkValueMtEntry = (h: Hasher, v: Value): Promise<bigint> => {
    switch (typeof v) {
      case 'number':
        return MtValue.mkValueInt(h, v);
      case 'string':
        return MtValue.mkValueString(h, v);
      case 'boolean':
        return MtValue.mkValueBool(h, v);
      default: {
        if (v instanceof Date) {
          return MtValue.mkValueTime(h, v);
        }
        throw new Error(`error: unexpected type ${typeof v}`);
      }
    }
  };

  static async mkValueInt(h: Hasher, v: number): Promise<bigint> {
    if (v >= 0) {
      return BigInt(v);
    }
    return h.prime() + BigInt(v);
  }

  static mkValueUInt = (h: Hasher, v: bigint): bigint => {
    return BigInt.asUintN(64, v);
  };

  static mkValueBool = (h: Hasher, v: boolean): Promise<bigint> => {
    if (v) {
      return h.hash([BigInt.asIntN(64, BigInt(1))]);
    }
    return h.hash([BigInt.asIntN(64, BigInt(0))]);
  };

  static mkValueString = (h: Hasher, v: string): Promise<bigint> => {
    return h.hashBytes(bytesEncoder.encode(v));
  };

  static mkValueTime = (h: Hasher, v: Date): Promise<bigint> => {
    // convert unixTimeStamp from ms -> ns as in go implementation
    const unixTimeStamp = v.valueOf() * 10_00_000; // parseInt(`${v.getTime()*10_00_000}`).toFixed(0)
    return MtValue.mkValueInt(h, unixTimeStamp);
  };
}
