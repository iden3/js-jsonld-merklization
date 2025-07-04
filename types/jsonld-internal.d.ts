declare module 'jsonld/lib/util.js' {
  export function parseLinkHeader(linkHeader: string): Record<string, unknown>;
}

declare module 'jsonld/lib/constants.js' {
  export const LINK_HEADER_CONTEXT: string;
}

declare module 'jsonld/lib/JsonLdError.js' {
  class JsonLdError extends Error {
    constructor(message: string, type: string, details?: any);
    name: string;
    type: string;
    details: unknown;
  }
  export = JsonLdError;
}

declare module 'jsonld/lib/url.js' {
  export function prependBase(base: string, iri: string): string;
}
