import { Temporal } from '@js-temporal/polyfill';
import { DocumentLoader } from '../loaders/jsonld-loader';

export interface Options {
  hasher?: Hasher;
  ipfsNodeURL?: string;
  ipfsGatewayURL?: string;
  documentLoader?: DocumentLoader;
}

export interface Hasher {
  hash: (inp: bigint[]) => Promise<bigint>;
  hashBytes: (b: Uint8Array) => Promise<bigint>;
  prime: () => bigint;
}

export enum NodeType {
  BlankNode = 'BlankNode',
  IRI = 'NamedNode',
  Literal = 'Literal',
  Undefined = 'Undefined'
}

export enum XSDNS {
  Boolean = 'http://www.w3.org/2001/XMLSchema#boolean',
  Integer = 'http://www.w3.org/2001/XMLSchema#integer',
  NonNegativeInteger = 'http://www.w3.org/2001/XMLSchema#nonNegativeInteger',
  NonPositiveInteger = 'http://www.w3.org/2001/XMLSchema#nonPositiveInteger',
  NegativeInteger = 'http://www.w3.org/2001/XMLSchema#negativeInteger',
  PositiveInteger = 'http://www.w3.org/2001/XMLSchema#positiveInteger',
  DateTime = 'http://www.w3.org/2001/XMLSchema#dateTime',
  Double = 'http://www.w3.org/2001/XMLSchema#double'
}

export const isDouble = (v: number) => String(v).includes('.') || Math.abs(v) >= 1e21;

export const canonicalDouble = (v: number) => v.toExponential(15).replace(/(\d)0*e\+?/, '$1E');

export type Value = boolean | number | Temporal.Instant | string | bigint;

export type Parts = Array<string | number>;

export interface ParsedCtx {
  mappings: Map<string, object | string>;
}
