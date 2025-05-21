import { Hasher, Value, Options } from './types/types';
import {
  compact,
  NodeObject,
  JsonLdDocument,
  ContextDefinition,
  Options as JsonLdOptions
} from 'jsonld';
import { Merkletree, Hash, Proof } from '@iden3/js-merkletree';
import { RDFDataset } from './rdf-dataset';
import { DEFAULT_HASHER } from './poseidon';
import { addEntriesToMerkleTree, getMerkleTreeInitParam } from './merkle-tree';
import { RDFEntry } from './rdf-entry';
import { Path } from './path';
import { MtValue } from './mt-value';
import { convertAnyToString, convertStringToXsdValue } from './utils';
import { getDocumentLoader, getHasher } from './options';

export class Merklizer {
  constructor(
    public readonly srcDoc: string | null = null,
    public readonly mt: Merkletree | null = null,
    public readonly hasher: Hasher = DEFAULT_HASHER,
    public readonly entries: Map<string, RDFEntry> = new Map(),
    public compacted: NodeObject | null = null,
    public documentLoader = getDocumentLoader()
  ) {
    if (!mt) {
      const { db, writable, maxLevels } = getMerkleTreeInitParam();
      this.mt = new Merkletree(db, writable, maxLevels);
    }
  }

  async proof(p: Path): Promise<{ proof: Proof; value?: MtValue }> {
    const kHash = await p.mtEntry();
    if (!this.mt) {
      throw new Error('Merkle tree is not initialized');
    }
    const { proof } = await this.mt.generateProof(kHash);

    if (proof.existence) {
      if (!this.entries.has(kHash.toString())) {
        throw new Error('error: [assertion] no entry found while existence is true');
      }
      const entry = this.entries.get(kHash.toString());
      if (!entry) {
        throw new Error('entry not found');
      }

      const value = new MtValue(entry.value, this.hasher);
      return { proof, value };
    }

    return { proof };
  }

  mkValue(val: Value): MtValue {
    return new MtValue(val, this.hasher);
  }

  async resolveDocPath(path: string, opts?: Options): Promise<Path> {
    if (!this.srcDoc) {
      throw new Error('Source document is not initialized');
    }
    const realPath = await Path.fromDocument(null, this.srcDoc, path, opts);
    realPath.hasher = this.hasher;
    return realPath;
  }

  async entry(path: Path): Promise<RDFEntry> {
    const key = await path.mtEntry();
    const e = this.entries.get(key.toString());
    if (!e) {
      throw new Error('entry not found');
    }

    return e;
  }

  // JSONLDType returns the JSON-LD type of the given path. If there is no literal
  // by this path, it returns an error.
  async jsonLDType(path: Path): Promise<string> {
    const entry = await this.entry(path);
    return entry.dataType;
  }

  async root(): Promise<Hash> {
    if (!this.mt) {
      throw new Error('Merkle tree is not initialized');
    }
    return this.mt.root();
  }

  rawValue(path: Path): Value {
    let parts = path.parts;
    if (!this.compacted) {
      throw new Error('Compact document is not initialized');
    }
    let obj: NodeObject = this.compacted;
    const traversedParts: string[] = [];
    const currentPath = (): string => traversedParts.join(' / ');

    while (parts.length > 0) {
      const p = parts[0];
      if (typeof p === 'string') {
        traversedParts.push(p);
        obj = (obj[p] ?? ((obj['@graph'] ?? {}) as NodeObject)[p]) as NodeObject;
        if (!obj) {
          throw new Error('value not found');
        }
      } else if (typeof p === 'number') {
        traversedParts.push(p.toString());
        obj = this.rvExtractArrayIdx(obj, p) as NodeObject;
      } else {
        throw new Error(`unexpected type of path ${currentPath()}`);
      }
      parts = parts.slice(1);
    }

    if (typeof obj['@value'] !== 'undefined') {
      return obj['@value'] as Value;
    }

    return obj as unknown as Value;
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

  static async merklizeJSONLD(docStr: string, opts?: Options): Promise<Merklizer> {
    const hasher = getHasher(opts);
    const documentLoader = getDocumentLoader(opts);
    const mz = new Merklizer(docStr, null, hasher, new Map(), null, documentLoader);
    if (!mz) {
      throw new Error('Merklizer is not initialized');
    }
    if (!mz.srcDoc) {
      throw new Error('Source document is not initialized');
    }
    const doc = JSON.parse(mz.srcDoc);
    const dataset = await RDFDataset.fromDocument(doc, documentLoader);
    const entries = await RDFEntry.fromDataSet(dataset, hasher);

    for (const e of entries) {
      const k = await e.getKeyMtEntry();
      mz.entries.set(k.toString(), e);
    }

    if (!mz.mt) {
      throw new Error('Merkle tree is not initialized');
    }
    await addEntriesToMerkleTree(mz.mt, entries);
    // input: JsonLdDocument, ctx?: ContextDefinition, options?: Options.Compact
    mz.compacted = await compact(
      doc as JsonLdDocument,
      {} as ContextDefinition,
      {
        documentLoader,
        base: null,
        compactArrays: true,
        compactToRelative: true
      } as unknown as JsonLdOptions.Compact
    );

    return mz;
  }

  static async hashValue(dataType: string, value: unknown): Promise<bigint> {
    return this.hashValueWithHasher(DEFAULT_HASHER, dataType, value);
  }

  private static async hashValueWithHasher(
    h: Hasher,
    dataType: string,
    value: unknown
  ): Promise<bigint> {
    const valueStr = convertAnyToString(value, dataType);

    const xsdValue = convertStringToXsdValue(dataType, valueStr, h.prime());

    return await MtValue.mkValueMtEntry(h, xsdValue);
  }

  get options(): Options {
    return {
      hasher: this.hasher,
      documentLoader: this.documentLoader
    };
  }
}
