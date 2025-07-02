import { MerklizationConstants } from './constants';
import * as n3 from 'n3';
import * as jsonld from 'jsonld';
import { DocumentLoader } from './loaders/jsonld-loader';
import { DatasetIdx } from './dataset-idx';
import { getGraphName } from './utils';
import { RefTp } from './ref-tp';
import { NodeType } from './types/types';
import { getDocumentLoader } from './options';

export class RDFDataset {
  constructor(public readonly graphs: Map<string, n3.Quad[]> = new Map()) {}
  // assert consistency of dataset and validate that only
  // quads we support contains in dataset.
  static assertDatasetConsistency = (ds: RDFDataset): void => {
    for (const [graph, quads] of ds.graphs) {
      for (const q of quads) {
        if (!graph) {
          throw new Error('empty graph name');
        }
        if (graph === MerklizationConstants.DEFAULT_GRAPH_NODE_NAME && q.graph.id) {
          throw new Error('graph should be nil for @default graph');
        }
        if (!q.graph.id && graph !== MerklizationConstants.DEFAULT_GRAPH_NODE_NAME) {
          throw new Error('graph should not be nil for non-@default graph');
        }
      }
    }
  };

  static async fromDocument(
    doc: jsonld.JsonLdDocument,
    documentLoader: DocumentLoader = getDocumentLoader()
  ): Promise<RDFDataset> {
    const normalizedData = await jsonld.canonize(doc, {
      format: MerklizationConstants.QUADS_FORMAT,
      documentLoader
    });
    const parser = new n3.Parser({ format: MerklizationConstants.QUADS_FORMAT });

    const quads: n3.Quad[] = parser.parse(normalizedData);
    const ds = new RDFDataset();
    for (const q of quads) {
      const graphName =
        q.graph.termType === MerklizationConstants.DEFAULT_GRAPH_TERM_TYPE
          ? MerklizationConstants.DEFAULT_GRAPH_NODE_NAME
          : q.graph.value;
      const graphQuads = ds.graphs.get(graphName) ?? [];
      graphQuads.push(q);
      ds.graphs.set(graphName, graphQuads);
    }

    return ds;
  }

  static getQuad(ds: RDFDataset, idx: DatasetIdx): n3.Quad {
    const quads = ds.graphs.get(idx.graphName);
    if (!quads) {
      throw MerklizationConstants.ERRORS.GRAPH_NOT_FOUND;
    }
    if (idx.idx >= quads.length) {
      throw MerklizationConstants.ERRORS.QUAD_NOT_FOUND;
    }
    return quads[idx.idx];
  }

  static iterGraphsOrdered(
    ds: RDFDataset,
    callback: (graphName: string, quads: n3.Quad[]) => void
  ) {
    const graphNames: string[] = [];
    for (const graphName of ds.graphs.keys()) {
      graphNames.push(graphName);
    }
    graphNames.sort((a, b) => a.localeCompare(b));

    for (const graphName of graphNames) {
      const quads = ds.graphs.get(graphName);
      if (!quads) {
        continue;
      }
      callback(graphName, quads);
    }
  }

  static findParent(ds: RDFDataset, q: n3.Quad): DatasetIdx | undefined {
    const parent = RDFDataset.findParentInsideGraph(ds, q);
    if (parent) {
      return parent;
    }

    return RDFDataset.findGraphParent(ds, q);
  }

  static findParentInsideGraph(ds: RDFDataset, q: n3.Quad): DatasetIdx | undefined {
    const graphName = getGraphName(q);
    let result: DatasetIdx | undefined;
    const quads = ds.graphs.get(graphName);
    if (!quads) {
      return undefined;
    }

    const qKey = RefTp.getRefFromQuad(q.subject as n3.Quad_Subject);
    if (qKey.tp === NodeType.Undefined) {
      return undefined;
    }
    let found = false;
    // var result datasetIdx
    for (let idx = 0; idx < quads.length; idx++) {
      const quad = quads[idx];
      if (quad.equals(q)) {
        continue;
      }

      const objKey = RefTp.getRefFromQuad(quad.object);
      if (objKey.tp === NodeType.Undefined) {
        continue;
      }

      if (qKey?.tp === objKey?.tp && qKey?.val === objKey?.val) {
        if (found) {
          throw MerklizationConstants.ERRORS.MULTIPLE_PARENTS_FOUND;
        }
        found = true;
        result = new DatasetIdx(graphName, idx);
      }
    }
    return result;
  }

  static findGraphParent(ds: RDFDataset, q: n3.Quad): DatasetIdx | undefined {
    if (!q.graph) {
      return undefined;
    }

    const qKey = RefTp.getRefFromQuad(q.graph);
    if (qKey.tp === NodeType.Undefined) {
      return undefined;
    }
    if (qKey.tp !== NodeType.BlankNode) {
      throw new Error('graph parent can only be a blank node');
    }

    let found = false;
    let result: DatasetIdx | undefined;
    for (const [graphName, quads] of ds.graphs) {
      for (let idx = 0; idx < quads.length; idx++) {
        const quad = quads[idx];

        if (quad.equals(q)) {
          continue;
        }

        const objKey = RefTp.getRefFromQuad(quad.object);
        if (objKey.tp === NodeType.Undefined) {
          continue;
        }

        if (qKey.toString() == objKey.toString()) {
          if (found) {
            throw MerklizationConstants.ERRORS.MULTIPLE_PARENTS_FOUND;
          }
          found = true;
          result = new DatasetIdx(graphName, idx);
        }
      }
    }

    if (found) {
      return result;
    }
    throw MerklizationConstants.ERRORS.PARENT_NOT_FOUND;
  }
}
