/* eslint-disable no-case-declarations */
// @ts-ignore-next-line
import { Quad } from 'n3';
import { MerklizationConstants } from './constants';
import { canonicalDouble, Value, XSDNS } from './types/types';
import { Temporal } from '@js-temporal/polyfill';

export function getGraphName(q: Quad): string {
  if (!q.graph.value) {
    return MerklizationConstants.DEFAULT_GRAPH_NODE_NAME;
  }

  if (q.graph.termType !== 'BlankNode') {
    throw new Error('graph node is not of BlankNode type');
  }

  return q.graph.value;
}

export const sortArr = <T>(arr: T[]): T[] => {
  return arr.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
};

export const byteEncoder = new TextEncoder();

export const validateValue = (val: Value): void => {
  switch (typeof val) {
    case 'boolean':
    case 'string':
    case 'bigint':
    case 'number':
      return;
    case 'object':
      if (val instanceof Temporal.Instant) {
        return;
      }
  }

  throw new Error(
    `unexpected value type ${typeof val}, expected boolean | number | Temporal.Instant | string`
  );
};

export interface Range {
  min: bigint;
  max: bigint;
}

export const minMaxFromPrime = (prime: bigint): Range => {
  const max = prime / 2n;
  const min = max - prime + 1n;
  return { min, max };
};

// return included minimum and included maximum values for integers by XSD type
export function minMaxByXSDType(xsdType: string, prime: bigint): Range {
  switch (xsdType) {
    case XSDNS.PositiveInteger:
      return { min: 1n, max: prime - 1n };
    case XSDNS.NonNegativeInteger:
      return { min: 0n, max: prime - 1n };
    case XSDNS.Integer:
      return minMaxFromPrime(prime);
    case XSDNS.NegativeInteger:
      return { min: minMaxFromPrime(prime).min, max: -1n };
    case XSDNS.NonPositiveInteger:
      return { min: minMaxFromPrime(prime).min, max: 0n };
    default:
      throw new Error(`unsupported XSD type: ${xsdType}`);
  }
}

export const convertStringToXsdValue = (
  dataType: string,
  valueStr: string,
  maxFieldValue: bigint
): Value => {
  switch (dataType) {
    case XSDNS.Boolean:
      switch (valueStr) {
        case 'false':
        case '0':
          return false;
        case 'true':
        case '1':
          return true;
        default:
          throw new Error('incorrect boolean value');
      }
    case XSDNS.Integer:
    case XSDNS.NonNegativeInteger:
    case XSDNS.NonPositiveInteger:
    case XSDNS.NegativeInteger:
    case XSDNS.PositiveInteger:
      const int = BigInt(valueStr);

      const { min, max } = minMaxByXSDType(dataType, maxFieldValue);

      if (int > max) {
        throw new Error(`integer exceeds maximum value: ${int}`);
      }

      if (int < min) {
        throw new Error(`integer is below minimum value: ${int}`);
      }

      return int;

    case XSDNS.DateTime: {
      if (isNaN(Date.parse(valueStr))) {
        throw new Error(`error: error parsing time string ${valueStr}`);
      }
      const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegEx.test(valueStr)) {
        return Temporal.Instant.from(new Date(valueStr).toISOString());
      }
      return Temporal.Instant.from(valueStr);
    }
    case XSDNS.Double:
      return canonicalDouble(parseFloat(valueStr));
    default:
      return valueStr;
  }
};

export const convertAnyToString = (v: unknown, datatype: string): string => {
  const isDoubleType = datatype === XSDNS.Double;
  switch (typeof v) {
    case 'string':
      return isDoubleType ? canonicalDouble(parseFloat(v)) : v;
    case 'boolean':
      return `${v}`;
    case 'number': {
      return isDoubleType ? canonicalDouble(v) : `${v}`;
    }
    default:
      throw new Error('unsupported type');
  }
};
