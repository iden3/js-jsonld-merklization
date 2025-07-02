import { JsonLdDocument, RemoteDocument, ParsedCtx } from 'jsonld';

declare module 'jsonld' {
  export function getInitialContext(opts: jsonLDOpts): ParsedCtx;

  export function processContext(
    activeCtx: ParsedCtx | null,
    localCtx: JsonLdDocument | null,
    opts: jsonLDOpts
  ): Promise<ParsedCtx>;
  export interface jsonLDOpts {
    documentLoader?: (
      url: string,
      callback: (err: Error, remoteDoc: RemoteDocument) => void
    ) => Promise<RemoteDocument>;
    [key: string]: unknown;
  }

  interface JsonLdErrorConstructor extends ErrorConstructor {
    new (
      message: string,
      code: string,
      details: {
        code: string;
        url: string;
        httpStatusCode?: number;
        redirects?: string[];
        cause?: unknown;
      }
    ): Error;
  }

  interface JsonLdError extends Error {
    code: string;
    details: {
      code: string;
      url: string;
      httpStatusCode?: number;
      redirects?: string[];
      cause?: unknown;
    };
  }

  // constructor for JsonLdError

  interface Constants {
    LINK_HEADER_CONTEXT: string;
  }

  interface Util {
    parseLinkHeader: (linkHeader: string) => Record<string, { target: string; type?: string }>;
  }

  interface Url {
    prependBase: (url: string, target: string) => string;
  }
  const constants: Constants;
  const util: Util;
  const url: Url;
  const JsonLdError: JsonLdErrorConstructor;

  function canonize(input: JsonLdDocument, options?: jsonLDOpts): Promise<string>;
}
