import { Hasher, NodeType } from './types/types';
import { Quad } from 'n3';
import { Path } from './path';
import { RefTp } from './ref-tp';
import { QuadArrKey } from './quad-arr-key';
import { RDFDataset } from './rdf-dataset';
import { DatasetIdx } from './dataset-idx';
import { DEFAULT_HASHER } from './poseidon';

export class Relationship {
  constructor(
    // string should be derived from instance of NodeID for the below maps
    public parents: Map<string, DatasetIdx> = new Map(),
    // map[qArrKey]map[refTp]int
    public children: Map<string, Map<string, number>> = new Map(),
    public hasher: Hasher = DEFAULT_HASHER
  ) {}

  static getIriValue(n: Quad): string {
    if (n.predicate.termType === NodeType.IRI) {
      return n.predicate.value;
    }
    throw new Error('type is not IRI');
  }

  path(dsIdx: DatasetIdx, ds: RDFDataset, idx: number): Path {
    const k = new Path([], this.hasher);
    if (typeof idx === 'number') {
      k.append([idx]);
    }
    const n = RDFDataset.getQuad(ds, dsIdx);

    const predicate = Relationship.getIriValue(n);
    k.append([predicate]);

    let nextKey = dsIdx;

    for (;;) {
      const parentIdx = this.parents.get(nextKey.toString());
      if (!parentIdx) {
        break;
      }
      const parent = RDFDataset.getQuad(ds, parentIdx);
      const parentKey = new QuadArrKey(parent);
      const childrenMap = this.children.get(parentKey.toString());

      if (!childrenMap) {
        throw new Error('parent mapping not found');
      }

      const childQuad = RDFDataset.getQuad(ds, nextKey);
      const childRef = RefTp.getRefFromQuad(childQuad.subject);
      const childIdx = childrenMap.get(childRef.toString());
      if (typeof childIdx !== 'number') {
        throw new Error('child not found in parents mapping');
      }

      const parentPredicate = Relationship.getIriValue(parent);

      if (childrenMap.size === 1) {
        k.append([parentPredicate]);
      } else {
        k.append([childIdx, parentPredicate]);
      }
      nextKey = parentIdx;
    }
    k.reverse();
    return k;
  }

  static async newRelationship(ds: RDFDataset, hasher: Hasher): Promise<Relationship> {
    const r = new Relationship(new Map(), new Map(), hasher);

    RDFDataset.iterGraphsOrdered(ds, (graphName, quads) => {
      for (let idx = 0; idx < quads.length; idx++) {
        const q = quads[idx];
        const parentIdx = RDFDataset.findParent(ds, q);
        if (!parentIdx) {
          continue;
        }
        const qIdx: DatasetIdx = new DatasetIdx(graphName, idx);
        r.parents.set(qIdx.toString(), parentIdx);
        const parentQuad = RDFDataset.getQuad(ds, parentIdx);
        const qKey = new QuadArrKey(parentQuad);
        //string here is json representation of RefTp interface
        let childrenM: Map<string, number> | undefined = r.children.get(qKey.toString());
        if (!childrenM) {
          childrenM = new Map();
          r.children.set(qKey.toString(), childrenM);
        }

        const childRef = RefTp.getRefFromQuad(q.subject);

        const childExists = childrenM.get(childRef.toString());
        if (typeof childExists !== 'number') {
          const nextIdx = childrenM.size;
          childrenM.set(childRef.toString(), nextIdx);
        }
      }
    });

    return r;
  }
}
