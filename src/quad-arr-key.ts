import * as n3 from 'n3';
import { getGraphName } from './utils';
import { RefTp } from './ref-tp';
import { NodeType } from './types/types';

export class QuadArrKey {
  subject: RefTp;
  predicate: unknown;
  graph: string;

  constructor(q: n3.Quad) {
    this.graph = getGraphName(q);
    const s = q.subject;
    switch (s.termType) {
      case NodeType.IRI:
        this.subject = { tp: NodeType.IRI, val: s.value };
        break;
      case NodeType.BlankNode:
        this.subject = { tp: NodeType.BlankNode, val: s.value };
        break;
      default:
        throw new Error('invalid subject type');
    }

    if (q.predicate.termType !== NodeType.IRI) {
      throw new Error('invalid predicate type');
    }
    this.predicate = q.predicate.value;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  static countEntries = (nodes: n3.Quad[]): Map<string, number> => {
    const res: Map<string, number> = new Map();
    for (const q of nodes) {
      const key = new QuadArrKey(q);
      let c = res.get(key.toString()) ?? 0;
      res.set(key.toString(), ++c);
    }
    return res;
  };
}
