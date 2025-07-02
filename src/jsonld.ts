import * as jsonld from 'jsonld';

export function getInitialContext(opts: jsonld.jsonLDOpts) {
  return jsonld.getInitialContext(opts);
}
