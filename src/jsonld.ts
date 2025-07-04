import jsonld from 'jsonld';

export function getInitialContext(opts: jsonld.JsonLDOpts) {
  return jsonld.processContext(null, null, opts);
}
