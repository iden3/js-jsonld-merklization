import { RemoteDocument } from 'jsonld/jsonld-spec';
import { getDocumentLoader } from '../src/options';
import { Options } from '../src/types/types';
import { W3C_CREDENTIAL_2018, W3C_VC_SCHEMA } from './data';
import { DocumentLoader } from '../src/loaders/jsonld-loader';

export const cacheLoader = (opts?: Options): DocumentLoader => {
  const cache = new Map<string, RemoteDocument>();
  cache.set(W3C_CREDENTIAL_2018, {
    document: W3C_VC_SCHEMA,
    documentUrl: W3C_CREDENTIAL_2018
  });
  const proofSchema = JSON.parse(`{
  "@context": {
    "@version": 1.1,
    "id": "@id",
    "type": "@type",
    "Iden3SparseMerkleTreeProof": {
      "@id": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3SparseMerkleTreeProof",
      "@context": {
        "@version": 1.1,
        "@propagate": true,
        "id": "@id",
        "type": "@type",
        "sec": "https://w3id.org/security#",
        "@vocab": "https://schema.iden3.io/core/vocab/Iden3SparseMerkleTreeProof.md#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "mtp": {
          "@id": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#SparseMerkleTreeProof",
          "@type": "SparseMerkleTreeProof"
        },
        "coreClaim": {
          "@id": "coreClaim",
          "@type": "xsd:string"
        },
        "issuerData": {
          "@id": "issuerData",
          "@context": {
            "@version": 1.1,
            "state": {
              "@id": "state",
              "@context": {
                "txId": {
                  "@id": "txId",
                  "@type": "xsd:string"
                },
                "blockTimestamp": {
                  "@id": "blockTimestamp",
                  "@type": "xsd:integer"
                },
                "blockNumber": {
                  "@id": "blockNumber",
                  "@type": "xsd:integer"
                },
                "rootOfRoots": {
                  "@id": "rootOfRoots",
                  "@type": "xsd:string"
                },
                "claimsTreeRoot": {
                  "@id": "claimsTreeRoot",
                  "@type": "xsd:string"
                },
                "revocationTreeRoot": {
                  "@id": "revocationTreeRoot",
                  "@type": "xsd:string"
                },
                "authCoreClaim": {
                  "@id": "authCoreClaim",
                  "@type": "xsd:string"
                },
                "value": {
                  "@id": "value",
                  "@type": "xsd:string"
                }
              }
            }
          }
        }
      }
    },
    "SparseMerkleTreeProof": {
      "@id": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#SparseMerkleTreeProof",
      "@context": {
        "@version": 1.1,
        "id": "@id",
        "type": "@type",
        "sec": "https://w3id.org/security#",
        "smt-proof-vocab": "https://schema.iden3.io/core/vocab/SparseMerkleTreeProof.md#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "existence": {
          "@id": "smt-proof-vocab:existence",
          "@type": "xsd:boolean"
        },
        "revocationNonce": {
          "@id": "smt-proof-vocab:revocationNonce",
          "@type": "xsd:number"
        },
        "siblings": {
          "@id": "smt-proof-vocab:siblings",
          "@container": "@list"
        },
        "nodeAux": "@nest",
        "hIndex": {
          "@id": "smt-proof-vocab:hIndex",
          "@nest": "nodeAux",
          "@type": "xsd:string"
        },
        "hValue": {
          "@id": "smt-proof-vocab:hValue",
          "@nest": "nodeAux",
          "@type": "xsd:string"
        }
      }
    },
    "BJJSignature2021": {
      "@id": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#BJJSignature2021",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "@vocab": "https://schema.iden3.io/core/vocab/BJJSignature2021.md#",
        "@propagate": true,
        "type": "@type",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "coreClaim": {
          "@id": "coreClaim",
          "@type": "xsd:string"
        },
        "issuerData": {
          "@id": "issuerData",
          "@context": {
            "@version": 1.1,
            "authCoreClaim": {
              "@id": "authCoreClaim",
              "@type": "xsd:string"
            },
            "mtp": {
              "@id": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#SparseMerkleTreeProof",
              "@type": "SparseMerkleTreeProof"
            },
            "revocationStatus": {
              "@id": "revocationStatus",
              "@type": "@id"
            },
            "state": {
              "@id": "state",
              "@context": {
                "@version": 1.1,
                "rootOfRoots": {
                  "@id": "rootOfRoots",
                  "@type": "xsd:string"
                },
                "claimsTreeRoot": {
                  "@id": "claimsTreeRoot",
                  "@type": "xsd:string"
                },
                "revocationTreeRoot": {
                  "@id": "revocationTreeRoot",
                  "@type": "xsd:string"
                },
                "value": {
                  "@id": "value",
                  "@type": "xsd:string"
                }
              }
            }
          }
        },
        "signature": {
          "@id": "signature",
          "@type": "https://w3id.org/security#multibase"
        },
        "domain": "https://w3id.org/security#domain",
        "creator": {
          "@id": "creator",
          "@type": "http://www.w3.org/2001/XMLSchema#string"
        },
        "challenge": "https://w3id.org/security#challenge",
        "created": {
          "@id": "created",
          "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
        },
        "expires": {
          "@id": "https://w3id.org/security#expiration",
          "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
        },
        "nonce": "https://w3id.org/security#nonce",
        "proofPurpose": {
          "@id": "https://w3id.org/security#proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@protected": true,
            "id": "@id",
            "type": "@type",
            "assertionMethod": {
              "@id": "https://w3id.org/security#assertionMethod",
              "@type": "@id",
              "@container": "@set"
            },
            "authentication": {
              "@id": "https://w3id.org/security#authenticationMethod",
              "@type": "@id",
              "@container": "@set"
            },
            "capabilityInvocation": {
              "@id": "https://w3id.org/security#capabilityInvocationMethod",
              "@type": "@id",
              "@container": "@set"
            },
            "capabilityDelegation": {
              "@id": "https://w3id.org/security#capabilityDelegationMethod",
              "@type": "@id",
              "@container": "@set"
            },
            "keyAgreement": {
              "@id": "https://w3id.org/security#keyAgreementMethod",
              "@type": "@id",
              "@container": "@set"
            }
          }
        },
        "proofValue": {
          "@id": "https://w3id.org/security#proofValue",
          "@type": "https://w3id.org/security#multibase"
        },
        "verificationMethod": {
          "@id": "https://w3id.org/security#verificationMethod",
          "@type": "@id"
        }
      }
    },
    "Iden3ReverseSparseMerkleTreeProof": {
      "@id": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3ReverseSparseMerkleTreeProof",
      "@context": {
        "@version": 1.1,
        "id": "@id",
        "type": "@type",
        "iden3-reverse-sparse-merkle-tree-proof-vocab": "https://schema.iden3.io/core/vocab/Iden3ReverseSparseMerkleTreeProof.md#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "revocationNonce": {
          "@id": "iden3-reverse-sparse-merkle-tree-proof-vocab:revocationNonce",
          "@type": "xsd:integer"
        },
        "statusIssuer": {
          "@context": {
            "@version": 1.1,
            "id": "@id",
            "type": "@type"
          },
          "@id": "iden3-reverse-sparse-merkle-tree-proof-vocab:statusIssuer"
        }
      }
    },
    "Iden3commRevocationStatusV1.0": {
      "@id": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3commRevocationStatusV1.0",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "iden3-comm-revocation-statusV1.0-vocab": "https://schema.iden3.io/core/vocab/Iden3commRevocationStatusV1.0.md#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "revocationNonce": {
          "@id": "iden3-comm-revocation-statusV1.0-vocab:revocationNonce",
          "@type": "xsd:integer"
        },
        "statusIssuer": {
          "@context": {
            "@version": 1.1,
            "@protected": true,
            "id": "@id",
            "type": "@type"
          },
          "@id": "iden3-comm-revocation-statusV1.0-vocab:statusIssuer"
        }
      }
    },
    "Iden3OnchainSparseMerkleTreeProof2023": {
      "@id": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3OnchainSparseMerkleTreeProof2023",
      "@context": {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "iden3-onchain-sparse-merkle-tree-proof-2023-vocab": "https://schema.iden3.io/core/vocab/Iden3OnchainSparseMerkleTreeProof2023.md#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "revocationNonce": {
          "@id": "iden3-onchain-sparse-merkle-tree-proof-2023-vocab:revocationNonce",
          "@type": "xsd:integer"  
        },
        "statusIssuer": {
          "@context": {
            "@version": 1.1,
            "@protected": true,
            "id": "@id",
            "type": "@type"
          },
          "@id": "iden3-onchain-sparse-merkle-tree-proof-2023-vocab:statusIssuer"
        }
      }
    },
    "JsonSchema2023": "https://www.w3.org/ns/credentials#JsonSchema2023",
    "Iden3RefreshService2023": "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld#Iden3RefreshService2023"
  }
}`);
  cache.set('https://schema.iden3.io/core/jsonld/iden3proofs.jsonld', {
    document: proofSchema,
    documentUrl: 'https://schema.iden3.io/core/jsonld/iden3proofs.jsonld'
  });
  const employeeSchema = JSON.parse(
    `{"@context":[{"@protected":true,"@version":1.1,"id":"@id","type":"@type","BasicPerson":{"@context":{"@propagate":true,"@protected":true,"polygon-vocab":"urn:uuid:bd42bba2-1caa-48b9-ab85-9509d33016bc#","xsd":"http://www.w3.org/2001/XMLSchema#","fullName":{"@id":"polygon-vocab:fullName","@type":"xsd:string"},"firstName":{"@id":"polygon-vocab:firstName","@type":"xsd:string"},"familyName":{"@id":"polygon-vocab:familyName","@type":"xsd:string"},"middleName":{"@id":"polygon-vocab:middleName","@type":"xsd:string"},"alsoKnownAs":{"@id":"polygon-vocab:alsoKnownAs","@type":"xsd:string"},"dateOfBirth":{"@id":"polygon-vocab:dateOfBirth","@type":"xsd:integer"},"governmentIdentifier":{"@id":"polygon-vocab:governmentIdentifier","@type":"xsd:string"},"governmentIdentifierType":{"@id":"polygon-vocab:governmentIdentifierType","@type":"xsd:string"},"gender":{"@id":"polygon-vocab:gender","@type":"xsd:string"},"email":{"@id":"polygon-vocab:email","@type":"xsd:string"},"sex":{"@id":"polygon-vocab:sex","@type":"xsd:string"},"phoneNumber":{"@id":"polygon-vocab:phoneNumber","@type":"xsd:double"},"phoneNumberVerified":{"@id":"polygon-vocab:phoneNumberVerified","@type":"xsd:boolean"},"title":{"@id":"polygon-vocab:title","@type":"xsd:string"},"salutation":{"@id":"polygon-vocab:salutation","@type":"xsd:string"},"documentExpirationDate":{"@id":"polygon-vocab:documentExpirationDate","@type":"xsd:integer"},"nameAndFamilyNameAtBirth":{"@context":{"firstName":{"@id":"polygon-vocab:firstName","@type":"xsd:string"},"familyName":{"@id":"polygon-vocab:familyName","@type":"xsd:string"}},"@id":"polygon-vocab:nameAndFamilyNameAtBirth"},"placeOfBirth":{"@context":{"locality":{"@id":"polygon-vocab:locality","@type":"xsd:string"},"region":{"@id":"polygon-vocab:region","@type":"xsd:string"},"countryCode":{"@id":"polygon-vocab:countryCode","@type":"xsd:string"},"countryCodeNumber":{"@id":"polygon-vocab:countryCodeNumber","@type":"xsd:integer"}},"@id":"polygon-vocab:placeOfBirth"},"addresses":{"@context":{"primaryAddress":{"@context":{"addressLine1":{"@id":"polygon-vocab:addressLine1","@type":"xsd:string"},"addressLine2":{"@id":"polygon-vocab:addressLine2","@type":"xsd:string"},"locality":{"@id":"polygon-vocab:locality","@type":"xsd:string"},"region":{"@id":"polygon-vocab:region","@type":"xsd:string"},"countryCode":{"@id":"polygon-vocab:countryCode","@type":"xsd:string"},"postalCode":{"@id":"polygon-vocab:postalCode","@type":"xsd:string"},"countryCodeNumber":{"@id":"polygon-vocab:countryCodeNumber","@type":"xsd:integer"},"unstructuredAddress":{"@id":"polygon-vocab:unstructuredAddress","@type":"xsd:string"}},"@id":"polygon-vocab:primaryAddress"},"homeAddress":{"@context":{"addressLine1":{"@id":"polygon-vocab:addressLine1","@type":"xsd:string"},"addressLine2":{"@id":"polygon-vocab:addressLine2","@type":"xsd:string"},"locality":{"@id":"polygon-vocab:locality","@type":"xsd:string"},"region":{"@id":"polygon-vocab:region","@type":"xsd:string"},"countryCode":{"@id":"polygon-vocab:countryCode","@type":"xsd:string"},"postalCode":{"@id":"polygon-vocab:postalCode","@type":"xsd:string"},"countryCodeNumber":{"@id":"polygon-vocab:countryCodeNumber","@type":"xsd:integer"},"unstructuredAddress":{"@id":"polygon-vocab:unstructuredAddress","@type":"xsd:string"}},"@id":"polygon-vocab:homeAddress"},"businessAddress":{"@context":{"addressLine1":{"@id":"polygon-vocab:addressLine1","@type":"xsd:string"},"addressLine2":{"@id":"polygon-vocab:addressLine2","@type":"xsd:string"},"locality":{"@id":"polygon-vocab:locality","@type":"xsd:string"},"region":{"@id":"polygon-vocab:region","@type":"xsd:string"},"countryCode":{"@id":"polygon-vocab:countryCode","@type":"xsd:string"},"postalCode":{"@id":"polygon-vocab:postalCode","@type":"xsd:string"},"countryCodeNumber":{"@id":"polygon-vocab:countryCodeNumber","@type":"xsd:integer"},"unstructuredAddress":{"@id":"polygon-vocab:unstructuredAddress","@type":"xsd:string"}},"@id":"polygon-vocab:businessAddress"},"mailingAddress":{"@context":{"addressLine1":{"@id":"polygon-vocab:addressLine1","@type":"xsd:string"},"addressLine2":{"@id":"polygon-vocab:addressLine2","@type":"xsd:string"},"locality":{"@id":"polygon-vocab:locality","@type":"xsd:string"},"region":{"@id":"polygon-vocab:region","@type":"xsd:string"},"countryCode":{"@id":"polygon-vocab:countryCode","@type":"xsd:string"},"postalCode":{"@id":"polygon-vocab:postalCode","@type":"xsd:string"},"countryCodeNumber":{"@id":"polygon-vocab:countryCodeNumber","@type":"xsd:integer"},"unstructuredAddress":{"@id":"polygon-vocab:unstructuredAddress","@type":"xsd:string"}},"@id":"polygon-vocab:mailingAddress"}},"@id":"polygon-vocab:addresses"},"nationalities":{"@context":{"nationality1CountryCode":{"@id":"polygon-vocab:nationality1CountryCode","@type":"xsd:string"},"nationality2CountryCode":{"@id":"polygon-vocab:nationality2CountryCode","@type":"xsd:string"},"nationality3CountryCode":{"@id":"polygon-vocab:nationality3CountryCode","@type":"xsd:string"},"nationality1CountryCodeNumber":{"@id":"polygon-vocab:nationality1CountryCodeNumber","@type":"xsd:integer"},"nationality2CountryCodeNumber":{"@id":"polygon-vocab:nationality2CountryCodeNumber","@type":"xsd:integer"},"nationality3CountryCodeNumber":{"@id":"polygon-vocab:nationality3CountryCodeNumber","@type":"xsd:integer"}},"@id":"polygon-vocab:nationalities"},"customFields":{"@context":{"string1":{"@id":"polygon-vocab:string1","@type":"xsd:string"},"string2":{"@id":"polygon-vocab:string2","@type":"xsd:string"},"string3":{"@id":"polygon-vocab:string3","@type":"xsd:string"},"number1":{"@id":"polygon-vocab:number1","@type":"xsd:double"},"number2":{"@id":"polygon-vocab:number2","@type":"xsd:double"},"number3":{"@id":"polygon-vocab:number3","@type":"xsd:double"},"boolean1":{"@id":"polygon-vocab:boolean1","@type":"xsd:boolean"},"boolean2":{"@id":"polygon-vocab:boolean2","@type":"xsd:boolean"},"boolean3":{"@id":"polygon-vocab:boolean3","@type":"xsd:boolean"}},"@id":"polygon-vocab:customFields"}},"@id":"urn:uuid:0a9897de-0ec5-42df-9e19-dbbe410b2924"}}]}`
  );
  cache.set('ipfs://QmZbsTnRwtCmbdg3r9o7Txid37LmvPcvmzVi1Abvqu1WKL', {
    document: employeeSchema,
    documentUrl: 'ipfs://QmZbsTnRwtCmbdg3r9o7Txid37LmvPcvmzVi1Abvqu1WKL'
  });
  return async (url): Promise<RemoteDocument> => {
    let remoteDoc = cache.get(url);
    if (remoteDoc) {
      return remoteDoc;
    }
    remoteDoc = await getDocumentLoader(opts)(url);
    cache.set(url, remoteDoc);
    return remoteDoc;
  };
};
