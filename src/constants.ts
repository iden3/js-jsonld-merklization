export const MerklizationConstants = Object.freeze({
  ERRORS: {
    CONTEXT_NOT_DEFINED: new Error('error: context not defined on the object'),
    PARSED_CONTEXT_IS_NULL: new Error('error: parsed context is null'),
    TERM_IS_NOT_DEFINED: new Error('error: term is not defined'),
    NO_ID_ATTR: new Error('error: no @id attribute is defined'),
    CTX_TYP_IS_EMPTY: new Error('error: ctx type is empty'),
    FIELD_PATH_IS_EMPTY: new Error('error: filed path is empty'),
    UNEXPECTED_ARR_ELEMENT: new Error('error: unexpected array elements'),
    INVALID_REFERENCE_TYPE: new Error('error: invalid reference type'),
    MULTIPLE_PARENTS_FOUND: new Error('error: multiple parents found'),
    PARENT_NOT_FOUND: new Error('error: parent not found'),
    GRAPH_NOT_FOUND: new Error('error: graph not found'),
    QUAD_NOT_FOUND: new Error('error: quad not found'),
    MT_VALUE_INCORRECT_TYPE: new Error('error: incorrect type')
  },
  DEFAULT_GRAPH_NODE_NAME: '@default',
  DEFAULT_GRAPH_TERM_TYPE: 'DefaultGraph',
  QUADS_FORMAT: 'application/n-quads',
  DIGITS_ONLY_REGEX: /^\d+$/,
  Q: BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617')
});
