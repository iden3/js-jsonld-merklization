import { RemoteDocument, Url } from 'jsonld/jsonld-spec';
import https from 'https';
import http from 'http';
import { parseLinkHeader } from 'jsonld/lib/util';
import { LINK_HEADER_CONTEXT } from 'jsonld/lib/constants';
import JsonLdError from 'jsonld/lib/JsonLdError';
import { prependBase } from 'jsonld/lib/url';
// eslint-disable-next-line  @typescript-eslint/no-var-requires
import 'cross-fetch/polyfill';

/**
 * Creates a built-in node document loader.
 *
 * @param options the options to use:
 *          [secure]: require all URLs to use HTTPS. (default: false)
 *          [strictSSL]: true to require SSL certificates to be valid,
 *            false not to. (default: true)
 *          [maxRedirects]: the maximum number of redirects to permit.
 *            (default: none)
 *          [headers]: an object (map) of headers which will be passed as
 *            request headers for the requested document. Accept is not
 *            allowed. (default: none).
 *          [httpAgent]: a Node.js `http.Agent` to use with 'http' requests.
 *            (default: none)
 *          [httpsAgent]: a Node.js `https.Agent` to use with 'https' requests.
 *            (default: An agent with rejectUnauthorized to the strictSSL
 *            value.ts)
 *
 * @return the node document loader.
 */
export class JsonLDLoader {
  async loadDocument(url: string, redirects: string[] = []) {
    const isHttp = url.startsWith('http:');
    const isHttps = url.startsWith('https:');
    if (!isHttp && !isHttps) {
      throw new JsonLdError(
        'URL could not be dereferenced; only "http" and "https" URLs are ' + 'supported.',
        'jsonld.InvalidUrl',
        { code: 'loading document failed', url }
      );
    }

    // TODO: disable cache until HTTP caching implemented
    // let doc = null; //cache.get(url);
    // if (doc !== null) {
    //   return doc;
    // }

    let alternate = null;

    const { res, body } = await _fetch({ url });
    const doc = { contextUrl: null, documentUrl: url, document: body || null };

    // handle error
    const statusText = http.STATUS_CODES[res.status];
    if (res.status >= 400) {
      throw new JsonLdError(
        `URL "${url}" could not be dereferenced: ${statusText}`,
        'jsonld.InvalidUrl',
        {
          code: 'loading document failed',
          url,
          httpStatusCode: res.status
        }
      );
    }
    const link = res.headers.get('link');
    let location = res.headers.get('location');
    const contentType = res.headers.get('content-type');

    // handle Link Header
    if (link && contentType !== 'application/ld+json' && contentType !== 'application/json') {
      // only 1 related link header permitted
      const linkHeaders = parseLinkHeader(link);
      const linkedContext = linkHeaders[LINK_HEADER_CONTEXT];
      if (Array.isArray(linkedContext)) {
        throw new JsonLdError(
          'URL could not be dereferenced, it has more than one associated ' + 'HTTP Link Header.',
          'jsonld.InvalidUrl',
          { code: 'multiple context link headers', url }
        );
      }
      if (linkedContext) {
        doc.contextUrl = linkedContext.target;
      }

      // "alternate" link header is a redirect
      alternate = linkHeaders.alternate;
      if (
        alternate &&
        alternate['type'] == 'application/ld+json' &&
        !(contentType || '').match(/^application\/(\w*\+)?json$/)
      ) {
        location = prependBase(url, alternate['target']);
      }
    }

    // handle redirect
    if ((alternate || (res.status >= 300 && res.status < 400)) && location) {
      if (redirects.length === -1) {
        throw new JsonLdError(
          'URL could not be dereferenced; there were too many redirects.',
          'jsonld.TooManyRedirects',
          {
            code: 'loading document failed',
            url,
            httpStatusCode: res.status,
            redirects
          }
        );
      }
      if (redirects.indexOf(url) !== -1) {
        throw new JsonLdError(
          'URL could not be dereferenced; infinite redirection was detected.',
          'jsonld.InfiniteRedirectDetected',
          {
            code: 'recursive context inclusion',
            url,
            httpStatusCode: res.status,
            redirects
          }
        );
      }
      redirects.push(url);
      // location can be relative, turn into full url
      const nextUrl = new URL(location, url).href;
      return this.loadDocument(nextUrl, redirects);
    }

    // cache for each redirected URL
    redirects.push(url);
    // TODO: disable cache until HTTP caching implemented
    /*
    for(let i = 0; i < redirects.length; ++i) {
      cache.set(
        redirects[i],
        {contextUrl: null, documentUrl: redirects[i], document: body});
    }
    */

    return doc;
  }
}

async function _fetch({ url }) {
  try {
    const res = await fetch(url);
    if (res.status >= 300 && res.status < 400) {
      return { res, body: null };
    }
    const text = await res.text();
    if (text && text.length > 0 && text.startsWith('{')) {
      return { res, body: JSON.parse(text) };
    }
    return { res, body: text };
  } catch (e) {
    // HTTP errors have a response in them
    // ky considers redirects HTTP errors
    if (e.response) {
      return { res: e.response, body: null };
    }
    throw new JsonLdError(
      'URL could not be dereferenced, an error occurred.',
      'jsonld.LoadDocumentError',
      { code: 'loading document failed', url, cause: e }
    );
  }
}

export const getJsonLdDocLoader = () => {
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  const docLoader = (url: Url, callback: (err: Error, remoteDoc: RemoteDocument) => void) => {
    const loader = new JsonLDLoader();
    return loader.loadDocument(url) as Promise<RemoteDocument>;
  };
  return docLoader;
};

export const jsonLdDocLoader = getJsonLdDocLoader();
