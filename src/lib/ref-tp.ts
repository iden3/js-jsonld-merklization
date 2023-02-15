import { Quad } from 'n3';
import { NodeType } from './types/types';

export class RefTp {
  constructor(public readonly tp: NodeType, public readonly val: unknown) {}

  toString(): string {
    return JSON.stringify(this);
  }

  static getRefFromQuad(n: Quad): RefTp {
    if (n.termType === NodeType.IRI) {
      return new RefTp(NodeType.IRI, n.value);
    }
    if (n.termType === NodeType.BlankNode) {
      return new RefTp(NodeType.BlankNode, n.value);
    }
    return new RefTp(NodeType.Undefined, '');
  }
}
