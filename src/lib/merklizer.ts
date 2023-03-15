import { Hasher, Value } from './types/types';
import { compact, NodeObject } from 'jsonld';
import { Merkletree, Hash, Proof } from '@iden3/js-merkletree';
import { RDFDataset } from './rdf-dataset';
import { DEFAULT_HASHER } from './poseidon';
import { addEntriesToMerkleTree, getMerkleTreeInitParam } from './merkle-tree';
import { RDFEntry } from './rdf-entry';
import { Path } from './path';
import { MtValue } from './mt-value';
import { jsonLdDocLoader } from '../loaders/jsonld-loader';

export class Merklizer {
  constructor(
    public readonly srcDoc: string | null = null,
    public readonly mt: Merkletree | null = null,
    public readonly hasher: Hasher = DEFAULT_HASHER,
    public readonly entries: Map<string, RDFEntry> = new Map(),
    public compacted: NodeObject | null = null
  ) {
    if (!mt) {
      const { db, writable, maxLevels } = getMerkleTreeInitParam();
      this.mt = new Merkletree(db, writable, maxLevels);
    }
  }

  async proof(p: Path): Promise<{ proof: Proof; value?: MtValue }> {
    const kHash = await p.mtEntry();
    const { proof } = await this.mt.generateProof(kHash);

    if (proof.existence) {
      if (!this.entries.has(kHash.toString())) {
        throw new Error('error: [assertion] no entry found while existence is true');
      }
      const entry = this.entries.get(kHash.toString());

      const value = new MtValue(entry.value, this.hasher);
      return { proof, value };
    }

    return { proof };
  }

  mkValue(val: Value): MtValue {
    return new MtValue(val, this.hasher);
  }

  async resolveDocPath(path: string): Promise<Path> {
    const realPath = await Path.fromDocument(null, this.srcDoc, path);
    realPath.hasher = this.hasher;
    return realPath;
  }

  root(): Hash {
    return this.mt.root;
  }

  rawValue(path: Path): Value {
    let parts = path.parts;
    let obj: unknown = this.compacted;
    const traversedParts: string[] = [];
    const currentPath = (): string => traversedParts.join(' / ');

    while (parts.length > 0) {
      const p = parts[0];
      if (typeof p === 'string') {
        traversedParts.push(p);
        obj = obj[p] ?? obj['@graph'][p];
        if (!obj) {
          throw new Error('value not found');
        }
      } else if (typeof p === 'number') {
        traversedParts.push(p.toString());
        obj = this.rvExtractArrayIdx(obj, p);
      } else {
        throw new Error(`unexpected type of path ${currentPath()}`);
      }
      parts = parts.slice(1);
    }

    if (obj['@value']) {
      return obj['@value'];
    }

    return obj as Value;
  }

  private rvExtractArrayIdx(obj: unknown, idx: number): unknown {
    const isArray = Array.isArray(obj);
    if (!isArray) {
      throw new Error('expected array');
    }
    if (idx < 0 || idx >= obj.length) {
      throw new Error('index is out of range');
    }
    return obj[idx];
  }
  

  static async merklizeJSONLD(docStr: string, options: {
      mt: Merkletree | null;
      hasher: Hasher;
      entries: Map<string, RDFEntry>;
      compacted: NodeObject | null;
    } = {
      mt: null,
      hasher: DEFAULT_HASHER,
      entries: new Map(),
      compacted: null
    }): Promise<Merklizer> {
    const mz = new Merklizer(docStr, 
      options.mt, 
      options.hasher, 
      options.entries, 
      options.compacted);
    const doc = JSON.parse(mz.srcDoc);
    const dataset = await RDFDataset.fromDocument(doc);
    const entries = await RDFEntry.fromDataSet(dataset, mz.hasher);

    for (const e of entries) {
      const k = await e.getKeyMtEntry();
      mz.entries.set(k.toString(), e);
    }

    await addEntriesToMerkleTree(mz.mt, entries);

    mz.compacted = await compact(
      doc,
      {},
      { documentLoader: jsonLdDocLoader, base: null, compactArrays: true, compactToRelative: true }
    );

    return mz;
  }
}
