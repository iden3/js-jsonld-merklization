import { Quad } from 'n3';
import { MerklizationConstants } from './constants';
import { Value, XSDNS } from './types/types';
import { Temporal } from 'temporal-polyfill';

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

export const convertStringToXsdValue = (dataType: string, valueStr: string): Value => {
  let value: Value;
  switch (dataType) {
    case XSDNS.Boolean:
      switch (valueStr) {
        case 'false':
        case '0':
          value = false;
          break;
        case 'true':
        case '1':
          value = true;
          break;
        default:
          throw new Error('incorrect boolean value');
      }
      break;
    case XSDNS.Integer:
    case XSDNS.NonNegativeInteger:
    case XSDNS.NonPositiveInteger:
    case XSDNS.NegativeInteger:
    case XSDNS.PositiveInteger:
      value = parseInt(valueStr);
      if (isNaN(value) || value.toString() !== valueStr){
        throw new Error('incorrect integer value');
      }
      break;
    case XSDNS.DateTime: {
      if (isNaN(Date.parse(valueStr))) {
        throw new Error(`error: error parsing time string ${valueStr}`);
      }
      const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegEx.test(valueStr)) {
        value = Temporal.Instant.from(new Date(valueStr).toISOString());
      } else {
        value = Temporal.Instant.from(valueStr);
      }
      break;
    }
    default:
      value = valueStr;
  }
  return value;
};

export const convertAnyToString = (v: unknown): string => {
  switch (typeof v) {
    case 'string':
    case 'number':
    case 'boolean':
      return `${v}`;
    default:
      throw new Error('unsupported type');
  }
};
