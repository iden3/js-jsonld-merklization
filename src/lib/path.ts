import { MerklizationConstants } from './constants';
import { Hasher, MerklizerOptions, Parts } from './types/types';
import { ContextParser, JsonLdContextNormalized } from 'jsonld-context-parser';
import { JsonLdDocument } from 'jsonld';
import { DEFAULT_HASHER } from './poseidon';
import { byteEncoder, sortArr } from './utils';
import { getDocumentLoader, getHasher } from './options';
import { IDocumentLoader } from 'jsonld-context-parser/lib/IDocumentLoader';
import { DocumentLoader } from '../loaders/jsonld-loader';
import { IJsonLdContext } from 'jsonld-context-parser/lib/JsonLdContext';

export class Path {
  constructor(public parts: Parts = [], public hasher: Hasher = DEFAULT_HASHER) {}

  reverse(): Parts {
    return this.parts.reverse();
  }

  append(p: Parts): void {
    this.parts = [...this.parts, ...p];
  }

  prepend(p: Parts): void {
    this.parts = [...p, ...this.parts];
  }

  async mtEntry(): Promise<bigint> {
    const h = this.hasher ?? DEFAULT_HASHER;

    const keyParts: bigint[] = new Array<bigint>(this.parts.length).fill(BigInt(0));

    for (let i = 0; i < this.parts.length; i += 1) {
      const p = this.parts[i];
      if (typeof p === 'string') {
        const b = byteEncoder.encode(p);
        keyParts[i] = await h.hashBytes(b);
      } else if (typeof p === 'number') {
        keyParts[i] = BigInt(p);
      } else {
        throw new Error(`error: unexpected type ${typeof p}`);
      }
    }

    return h.hash(keyParts);
  }

  async pathFromContext(docStr: string, path: string, opts?: MerklizerOptions): Promise<void> {
    const doc = JSON.parse(docStr);
    const context = doc['@context'];
    if (!context) {
      throw MerklizationConstants.ERRORS.CONTEXT_NOT_DEFINED;
    }
    const docLoader = documentLoaderAdapter(getDocumentLoader(opts));
    const ctxParser = new ContextParser({ documentLoader: docLoader });
    let parsedCtx = await ctxParser.parse(doc['@context']);

    const parts = path.split('.');

    for (const i in parts) {
      const p = parts[i];
      if (MerklizationConstants.DIGITS_ONLY_REGEX.test(p)) {
        this.parts.push(parseInt(p));
      } else {
        if (!parsedCtx) {
          throw MerklizationConstants.ERRORS.PARSED_CONTEXT_IS_NULL;
        }
        const m = parsedCtx.getContextRaw()[p];
        if (typeof m !== 'object') {
          throw MerklizationConstants.ERRORS.TERM_IS_NOT_DEFINED;
        }

        const id = m['@id'];
        if (!id) {
          throw MerklizationConstants.ERRORS.NO_ID_ATTR;
        }

        const nextCtx = m['@context'];
        if (nextCtx) {
          parsedCtx = await ctxParser.parse(nextCtx);
        }
        this.parts.push(id);
      }
    }
  }

  async typeFromContext(ctxStr: string, path: string, opts?: MerklizerOptions): Promise<string> {
    const ctxObj = JSON.parse(ctxStr);

    const docLoader = documentLoaderAdapter(getDocumentLoader(opts));
    const ctxParser = new ContextParser({ documentLoader: docLoader });
    let parsedCtx = await ctxParser.parse(ctxObj['@context']);

    const parts = path.split('.');

    for (const i in parts) {
      const p = parts[i];

      if (!parsedCtx) {
        throw MerklizationConstants.ERRORS.PARSED_CONTEXT_IS_NULL;
      }
      const m = parsedCtx.getContextRaw()[p];
      if (typeof m !== 'object') {
        throw MerklizationConstants.ERRORS.TERM_IS_NOT_DEFINED;
      }

      const id = m['@id'];
      if (!id) {
        throw MerklizationConstants.ERRORS.NO_ID_ATTR;
      }

      const nextCtx = m['@context'];
      if (nextCtx) {
        parsedCtx = await ctxParser.parse(nextCtx);
      }
      this.parts.push(id);
    }

    return Path.getTypeMapping(parsedCtx, parts[parts.length - 1]);
  }

  private static getTypeMapping(ctx: JsonLdContextNormalized, prop: string): string {
    let rval = '';
    const defaultT = ctx.getContextRaw()['@type'];
    if (defaultT) {
      rval = defaultT as string;
    }
    const propDef = ctx.getContextRaw()[prop];
    if (propDef && propDef['@type']) {
      rval = propDef['@type'] as string;
    }
    return rval;
  }

  static newPath = (parts: Parts): Path => {
    const p = new Path();
    p.append(parts);
    return p;
  };

  private static async pathFromDocument(
    ldCTX: JsonLdContextNormalized | null,
    doc: JsonLdDocument,
    pathParts: string[],
    acceptArray: boolean,
    opts?: MerklizerOptions
  ): Promise<Parts> {
    if (pathParts.length === 0) {
      return [];
    }

    const term = pathParts[0];
    const newPathParts = pathParts.slice(1);

    const docLoader = documentLoaderAdapter(getDocumentLoader(opts));
    const ctxParser = new ContextParser({ documentLoader: docLoader });

    if (MerklizationConstants.DIGITS_ONLY_REGEX.test(term)) {
      const num = parseInt(term);
      const moreParts = await Path.pathFromDocument(ldCTX, doc, newPathParts, true, opts);

      return [num, ...moreParts];
    }

    if (typeof doc !== 'object') {
      throw new Error(`error: expected type object got ${typeof doc}`);
    }

    let docObjMap = {};

    if (Array.isArray(doc)) {
      if (!doc.length) {
        throw new Error("errror: can't generate path on zero-sized array");
      }
      if (!acceptArray) {
        throw MerklizationConstants.ERRORS.UNEXPECTED_ARR_ELEMENT;
      }

      return Path.pathFromDocument(ldCTX, doc[0], pathParts, false, opts);
    } else {
      docObjMap = doc;
    }

    const ctxData = docObjMap['@context'];
    if (ctxData) {
      if (ldCTX) {
        ldCTX = await ctxParser.parse(ctxData, { parentContext: ldCTX.getContextRaw() });
      } else {
        ldCTX = await ctxParser.parse(ctxData);
      }
    }

    const elemKeys = sortArr(Object.keys(docObjMap));
    const typedScopedCtx = ldCTX;

    for (const k in elemKeys) {
      const key = elemKeys[k];
      const expandTerm = ldCTX.expandTerm(key, true);

      if (!(expandTerm === 'type' || expandTerm === '@type')) {
        continue;
      }

      let types: string[] = [];

      if (Array.isArray(docObjMap[key])) {
        docObjMap[key].forEach((e) => {
          if (typeof e !== 'string') {
            throw new Error(`error: @type value must be an array of strings: ${typeof e}`);
          }
          types.push(e as string);
          types = sortArr(types);
        });
      } else if (typeof docObjMap[key] === 'string') {
        types.push(docObjMap[key]);
      } else {
        throw new Error(`error: unexpected @type fied type: ${typeof docObjMap[key]}`);
      }

      for (const tt of types) {
        const td = typedScopedCtx.getContextRaw()[tt];
        if (typeof td === 'object') {
          if (td) {
            const ctxObj = td['@context'];
            if (ctxObj) {
              ldCTX = await ctxParser.parse(ctxObj, { parentContext: ldCTX.getContextRaw() });
            }
          }
        }
      }

      break;
    }

    const m = await ldCTX.getContextRaw()[term];
    const id = m['@id'];
    if (!id) {
      throw MerklizationConstants.ERRORS.NO_ID_ATTR;
    }
    if (typeof id !== 'string') {
      throw new Error(`error: @id attr is not of type stirng: ${typeof id}`);
    }

    const moreParts = await Path.pathFromDocument(ldCTX, docObjMap[term], newPathParts, true, opts);

    return [id, ...moreParts];
  }

  static async newPathFromCtx(
    docStr: string,
    path: string,
    opts?: MerklizerOptions
  ): Promise<Path> {
    const p = new Path([], getHasher(opts));
    await p.pathFromContext(docStr, path, opts);
    return p;
  }

  static getContextPathKey = async (
    docStr: string,
    ctxTyp: string,
    fieldPath: string,
    opts?: MerklizerOptions
  ): Promise<Path> => {
    if (ctxTyp === '') {
      throw MerklizationConstants.ERRORS.CTX_TYP_IS_EMPTY;
    }
    if (fieldPath === '') {
      throw MerklizationConstants.ERRORS.FIELD_PATH_IS_EMPTY;
    }

    const fullPath = await Path.newPathFromCtx(docStr, `${ctxTyp}.${fieldPath}`, opts);
    const typePath = await Path.newPathFromCtx(docStr, ctxTyp, opts);
    return new Path(fullPath.parts.slice(typePath.parts.length));
  };

  static async fromDocument(
    ldCTX: JsonLdContextNormalized | null,
    docStr: string,
    path: string,
    opts?: MerklizerOptions
  ): Promise<Path> {
    const doc = JSON.parse(docStr);
    const pathParts = path.split('.');
    if (pathParts.length === 0) {
      throw MerklizationConstants.ERRORS.FIELD_PATH_IS_EMPTY;
    }

    const p = await Path.pathFromDocument(ldCTX, doc, pathParts, false, opts);
    return new Path(p, getHasher(opts));
  }

  static async newTypeFromContext(
    contextStr: string,
    path: string,
    opts?: MerklizerOptions
  ): Promise<string> {
    const p = new Path([], getHasher(opts));
    return await p.typeFromContext(contextStr, path, opts);
  }

  static async getTypeIDFromContext(
    ctxStr: string,
    typeName: string,
    opts?: MerklizerOptions
  ): Promise<string> {
    const ctxObj = JSON.parse(ctxStr);

    const documentLoader = documentLoaderAdapter(getDocumentLoader(opts));
    const ctxParser = new ContextParser({ documentLoader });
    const parsedCtx = await ctxParser.parse(ctxObj['@context']);
    const typeDef = parsedCtx.getContextRaw()[typeName];

    if (!typeDef) {
      throw new Error(`looks like ${typeName} is not a type`);
    }

    const typeID = typeDef['@id'];
    if (!typeID) {
      throw new Error(`@id attribute is not found for type ${typeName}`);
    }

    // const typeIDStr = typeID.(string)
    if (typeof typeID !== 'string') {
      throw new Error(`@id attribute is not a string for type ${typeName}`);
    }

    return typeID;
  }
}

function documentLoaderAdapter(docLoader: DocumentLoader): IDocumentLoader {
  return {
    async load(url: string): Promise<IJsonLdContext> {
      const doc = await docLoader(url);
      return doc.document;
    }
  };
}
