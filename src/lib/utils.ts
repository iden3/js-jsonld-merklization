import { Quad } from 'n3';
import { MerklizationConstants } from './constants';
import { Value } from './types/types';
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
