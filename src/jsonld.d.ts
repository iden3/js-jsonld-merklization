import { JsonLdDocument, ParsedCtx, RemoteDocument } from 'jsonld';

declare module 'jsonld' {
  export function processContext(
    activeCtx: ParsedCtx | null,
    localCtx: JsonLdDocument | null,
    opts: JsonLDOpts
  ): Promise<ParsedCtx>;

  export interface JsonLDOpts {
    documentLoader?: (
      url: string,
      callback: (err: Error, remoteDoc: RemoteDocument) => void
    ) => Promise<RemoteDocument>;
    [key: string]: unknown;
  }

  function canonize(input: JsonLdDocument, options?: JsonLDOpts): Promise<string>;

  // jsonld@9 forwards canonicalization settings via `canonizeOptions` to
  // rdf-canonize. @types/jsonld predates this, so augment Options.Normalize.
  namespace Options {
    interface Normalize {
      canonizeOptions?: {
        algorithm?: 'URDNA2015' | 'RDFC-1.0';
        [key: string]: unknown;
      };
    }
  }
}

declare module 'jsonld/lib/constants' {
  export const LINK_HEADER_CONTEXT: string;
}

declare module 'jsonld/lib/util.js' {
  export function parseLinkHeader(
    linkHeader: string
  ): Record<string, { target: string; type?: string }>;
}

declare module 'jsonld/lib/url.js' {
  export function prependBase(url: string, target: string): string;
}

declare module 'jsonld/lib/JsonLdError.js' {
  export class JsonLdError extends Error {
    constructor(
      message: string,
      code: string,
      details: {
        code: string;
        url: string;
        httpStatusCode?: number;
        redirects?: string[];
        cause?: unknown;
      }
    );
  }
}
