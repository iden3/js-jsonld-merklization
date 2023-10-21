export const doc1 = `
{
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/iden3credential-v2.json-ld",
        "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld"
    ],
    "@type": [
        "VerifiableCredential",
        "KYCAgeCredential"
    ],
    "id": "http://myid.com",
    "expirationDate": "2261-03-21T21:14:48+02:00",
    "credentialSubject": {
        "type": "KYCAgeCredential",
        "id": "did:iden3:polygon:mumbai:wyFiV4w71QgWPn6bYLsZoysFay66gKtVa9kfu6yMZ",
        "documentType": 1,
        "birthday": 19960424
    },
    "credentialStatus": {
        "type": "SparseMerkleTreeProof",
        "id": "http://localhost:8001/api/v1/identities/1195DjqzhZ9zpHbezahSevDMcxN41vs3Y6gb4noRW/claims/revocation/status/127366661"
    },
    "credentialSchema": {
        "type": "JsonSchemaValidator2018",
        "id": "http://json1.com"
    }
}`;

export const multigraphDoc = `{
  "@context":[
    "https://www.w3.org/2018/credentials/v1",
    "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld"
  ],
  "@type":"VerifiablePresentation",
  "holder": ["http://example.com/holder1", "http://example.com/holder2"],
  "verifiableCredential": {
    "@id": "http://example.com/vc2",
    "@type":"KYCAgeCredential",
    "birthday":19960425
  }
}`;

export const multigraphDoc2 = `{
  "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
      "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/iden3credential-v2.json-ld"
  ],
  "@type": "VerifiablePresentation",
  "holder": [
      "http://example.com/holder1",
      "http://example.com/holder2"
  ],
  "verifiableCredential": [
      {
          "@id": "http://example.com/vc1",
          "@type": "KYCAgeCredential",
          "birthday": 19960424
      },
      {
          "@id": "http://example.com/vc3",
          "@type": "Iden3SparseMerkleTreeProof",
          "issuerData": {
              "state": {
                  "blockTimestamp": 123
              }
          }
      }
  ]
}`;

export const testDocument = `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/citizenship/v1",
    "https://w3id.org/security/bbs/v1"
  ],
  "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
  "type": ["VerifiableCredential", "PermanentResidentCard"],
  "issuer": "did:example:489398593",
  "identifier": 83627465,
  "name": "Permanent Resident Card",
  "description": "Government of Example Permanent Resident Card.",
  "issuanceDate": "2019-12-03T12:19:52Z",
  "expirationDate": "2029-12-03T12:19:52Z",
  "credentialSubject": [
    {
      "id": "did:example:b34ca6cd37bbf23",
      "type": ["PermanentResident", "Person"],
      "givenName": "JOHN",
      "familyName": "SMITH",
      "gender": "Male",
      "image": "data:image/png;base64,iVBORw0KGgokJggg==",
      "residentSince": "2015-01-01",
      "lprCategory": "C09",
      "lprNumber": "999-999-999",
      "commuterClassification": "C1",
      "birthCountry": "Bahamas",
      "birthDate": "1958-07-17"
    },
    {
      "id": "did:example:b34ca6cd37bbf24",
      "type": ["PermanentResident", "Person"],
      "givenName": "JOHN",
      "familyName": "SMITH",
      "gender": "Male",
      "image": "data:image/png;base64,iVBORw0KGgokJggg==",
      "residentSince": "2015-01-01",
      "lprCategory": "C09",
      "lprNumber": "999-999-999",
      "commuterClassification": "C1",
      "birthCountry": "Bahamas",
      "birthDate": "1958-07-18"
    }
  ]
}`;

export const nestedFieldDocument = `{
  "@context": [
    {
      "@version": 1.1,
      "@protected": true,
      "id": "@id",
      "type": "@type",
      "CustomType": {
        "@id": "urn:uuid:79f824ba-fee3-11ed-be56-0242ac120002",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "@propagate": true,
          "id": "@id",
          "type": "@type",
          "xsd": "http://www.w3.org/2001/XMLSchema#",
          "customField": {
            "@id": "polygon-vocab:customField",
            "@type": "xsd:string"
          },
          "polygon-vocab": "urn:uuid:87caf7a2-fee3-11ed-be56-0242ac120001#",
          "objectField": {
            "@id": "polygon-vocab:objectField",
            "@context": {
              "@version": 1.1,
              "@protected": true,
              "id": "@id",
              "type": "@type",
              "customNestedField": {
                "@id": "polygon-vocab:customNestedField",
                "@type": "xsd:integer"
              }
            }
          }
        }
      }
    }
  ],
  "id": "urn:urn:e27a921e-fee5-11ed-be56-0242ac100000",
  "type": ["CustomType"],
  "customField": "1234",
  "objectField": {
    "customNestedField": 1
  }
}`;

export const credentials_v1 = `
{
  "@context": {
    "@version": 1.1,
    "@protected": true,

    "id": "@id",
    "type": "@type",

    "VerifiableCredential": {
      "@id": "https://www.w3.org/2018/credentials#VerifiableCredential",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "cred": "https://www.w3.org/2018/credentials#",
        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "credentialSchema": {
          "@id": "cred:credentialSchema",
          "@type": "@id",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "cred": "https://www.w3.org/2018/credentials#",

            "JsonSchemaValidator2018": "cred:JsonSchemaValidator2018"
          }
        },
        "credentialStatus": {"@id": "cred:credentialStatus", "@type": "@id"},
        "credentialSubject": {"@id": "cred:credentialSubject", "@type": "@id"},
        "evidence": {"@id": "cred:evidence", "@type": "@id"},
        "expirationDate": {"@id": "cred:expirationDate", "@type": "xsd:dateTime"},
        "holder": {"@id": "cred:holder", "@type": "@id"},
        "issued": {"@id": "cred:issued", "@type": "xsd:dateTime"},
        "issuer": {"@id": "cred:issuer", "@type": "@id"},
        "issuanceDate": {"@id": "cred:issuanceDate", "@type": "xsd:dateTime"},
        "proof": {"@id": "sec:proof", "@type": "@id", "@container": "@graph"},
        "refreshService": {
          "@id": "cred:refreshService",
          "@type": "@id",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "cred": "https://www.w3.org/2018/credentials#",

            "ManualRefreshService2018": "cred:ManualRefreshService2018"
          }
        },
        "termsOfUse": {"@id": "cred:termsOfUse", "@type": "@id"},
        "validFrom": {"@id": "cred:validFrom", "@type": "xsd:dateTime"},
        "validUntil": {"@id": "cred:validUntil", "@type": "xsd:dateTime"}
      }
    },

    "VerifiablePresentation": {
      "@id": "https://www.w3.org/2018/credentials#VerifiablePresentation",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "cred": "https://www.w3.org/2018/credentials#",
        "sec": "https://w3id.org/security#",

        "holder": {"@id": "cred:holder", "@type": "@id"},
        "proof": {"@id": "sec:proof", "@type": "@id", "@container": "@graph"},
        "verifiableCredential": {"@id": "cred:verifiableCredential", "@type": "@id", "@container": "@graph"}
      }
    },

    "EcdsaSecp256k1Signature2019": {
      "@id": "https://w3id.org/security#EcdsaSecp256k1Signature2019",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "sec": "https://w3id.org/security#",

            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },

    "EcdsaSecp256r1Signature2019": {
      "@id": "https://w3id.org/security#EcdsaSecp256r1Signature2019",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "sec": "https://w3id.org/security#",

            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },

    "Ed25519Signature2018": {
      "@id": "https://w3id.org/security#Ed25519Signature2018",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "id": "@id",
        "type": "@type",

        "sec": "https://w3id.org/security#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",

        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "sec": "https://w3id.org/security#",

            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },

    "RsaSignature2018": {
      "@id": "https://w3id.org/security#RsaSignature2018",
      "@context": {
        "@version": 1.1,
        "@protected": true,

        "challenge": "sec:challenge",
        "created": {"@id": "http://purl.org/dc/terms/created", "@type": "xsd:dateTime"},
        "domain": "sec:domain",
        "expires": {"@id": "sec:expiration", "@type": "xsd:dateTime"},
        "jws": "sec:jws",
        "nonce": "sec:nonce",
        "proofPurpose": {
          "@id": "sec:proofPurpose",
          "@type": "@vocab",
          "@context": {
            "@version": 1.1,
            "@protected": true,

            "id": "@id",
            "type": "@type",

            "sec": "https://w3id.org/security#",

            "assertionMethod": {"@id": "sec:assertionMethod", "@type": "@id", "@container": "@set"},
            "authentication": {"@id": "sec:authenticationMethod", "@type": "@id", "@container": "@set"}
          }
        },
        "proofValue": "sec:proofValue",
        "verificationMethod": {"@id": "sec:verificationMethod", "@type": "@id"}
      }
    },

    "proof": {"@id": "https://w3id.org/security#proof", "@type": "@id", "@container": "@graph"}
  }
}`;

export const kycschema_jsonld = `{
  "@context": [
    {
      "@version": 1.1,
      "@protected": true,
      "id": "@id",
      "type": "@type",
      "KYCAgeCredential": {
        "@id": "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.json-ld#KYCAgeCredential",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "id": "@id",
          "type": "@type",
          "kyc-vocab": "https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#",
          "xsd": "http://www.w3.org/2001/XMLSchema#",
          "birthday": {
            "@id": "kyc-vocab:birthday",
            "@type": "xsd:integer"
          },
          "documentType": {
            "@id": "kyc-vocab:documentType",
            "@type": "xsd:integer"
          }
        }
      },
      "KYCCountryOfResidenceCredential": {
        "@id": "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.json-ld#KYCCountryOfResidenceCredential",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "id": "@id",
          "type": "@type",
          "kyc-vocab": "https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#",
          "xsd": "http://www.w3.org/2001/XMLSchema#",
          "countryCode": {
            "@id": "kyc-vocab:countryCode",
            "@type": "xsd:integer"
          },
          "documentType": {
            "@id": "kyc-vocab:documentType",
            "@type": "xsd:integer"
          }
        }
      },
      "KYCEmployee": {
        "@id": "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.json-ld#KYCJobExperiance",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "id": "@id",
          "type": "@type",
          "kyc-vocab": "https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#",
          "xsd": "http://www.w3.org/2001/XMLSchema#",
          "documentType": {
            "@id": "kyc-vocab:documentType",
            "@type": "xsd:integer"
          },
          "ZKPexperiance": {
            "@id": "kyc-vocab:hasZKPexperiance",
            "@type": "xsd:boolean"
          },
          "hireDate": {
            "@id": "kyc-vocab:hireDate",
            "@type": "xsd:dateTime"
          },
          "position": {
            "@id": "kyc-vocab:position",
            "@type": "xsd:string"
          },
          "salary": {
            "@id": "kyc-vocab:salary",
            "@type": "xsd:double"
          }
        }
      }
    }
  ]
}`;
export const docWithDouble = `{
  "http://example.com/field1": {
    "@type": "http://www.w3.org/2001/XMLSchema#double",
    "@value": 123
  },
  "http://example.com/field2": {
    "@type": "http://www.w3.org/2001/XMLSchema#double",
    "@value": "123"
  }
}`;

export const vp = `{
  "verifiableCredential": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v101.json-ld"
    ],
    "@type": [
      "VerifiableCredential",
      "KYCEmployee"
    ],
    "credentialSubject": {
      "@type": "KYCEmployee",
      "salary": 170000
    }
  },
  "@type": "VerifiablePresentation",
  "@context": [
    "https://www.w3.org/2018/credentials/v1"
  ]
}`;

export const ipfsDocument = `{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "ipfs://QmdP4MZkESEabRVB322r2xWm7TCi7LueMNWMJawYmSy7hp",
	  "ipfs://Qmbp4kwoHULnmK71abrxdksjPH5sAjxSAXU5PEp2XRMFNw/dir2/bbs-v2.jsonld"
  ],
  "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
  "type": ["VerifiableCredential", "PermanentResidentCard"],
  "issuer": "did:example:489398593",
  "identifier": 83627465,
  "name": "Permanent Resident Card",
  "description": "Government of Example Permanent Resident Card.",
  "issuanceDate": "2019-12-03T12:19:52Z",
  "expirationDate": "2029-12-03T12:19:52Z",
  "credentialSubject": [
    {
      "id": "did:example:b34ca6cd37bbf23",
      "type": ["PermanentResident", "Person"],
      "givenName": "JOHN",
      "familyName": "SMITH",
      "gender": "Male",
      "image": "data:image/png;base64,iVBORw0KGgokJggg==",
      "residentSince": "2015-01-01",
      "lprCategory": "C09",
      "lprNumber": "999-999-999",
      "commuterClassification": "C1",
      "birthCountry": "Bahamas",
      "birthDate": "1958-07-17"
    },
    {
      "id": "did:example:b34ca6cd37bbf24",
      "type": ["PermanentResident", "Person"],
      "givenName": "JOHN",
      "familyName": "SMITH",
      "gender": "Male",
      "image": "data:image/png;base64,iVBORw0KGgokJggg==",
      "residentSince": "2015-01-01",
      "lprCategory": "C09",
      "lprNumber": "999-999-999",
      "commuterClassification": "C1",
      "birthCountry": "Bahamas",
      "birthDate": "1958-07-18"
    }
  ]
}`;

export const kycV102 = `
{
  "@context": [
    {
      "@version": 1.1,
      "@protected": true,
      "id": "@id",
      "type": "@type",
      "KYCAgeCredential": {
        "@id": "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "id": "@id",
          "type": "@type",
          "kyc-vocab": "https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#",
          "xsd": "http://www.w3.org/2001/XMLSchema#",
          "birthday": {
            "@id": "kyc-vocab:birthday",
            "@type": "xsd:integer"
          },
          "documentType": {
            "@id": "kyc-vocab:documentType",
            "@type": "xsd:integer"
          }
        }
      },
      "KYCCountryOfResidenceCredential": {
        "@id": "urn:uuid:a81d4fae-7dec-11d0-a765-00a0c91e6bf0",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "id": "@id",
          "type": "@type",
          "kyc-vocab": "https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#",
          "xsd": "http://www.w3.org/2001/XMLSchema#",
          "countryCode": {
            "@id": "kyc-vocab:countryCode",
            "@type": "xsd:integer"
          },
          "documentType": {
            "@id": "kyc-vocab:documentType",
            "@type": "xsd:integer"
          }
        }
      },
      "KYCEmployee": {
        "@id": "urn:uuid:b71d4fae-7dec-11d0-a765-00a0c91e6bf1",
        "@context": {
          "@version": 1.1,
          "@protected": true,
          "id": "@id",
          "type": "@type",
          "kyc-vocab": "https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#",
          "xsd": "http://www.w3.org/2001/XMLSchema#",
          "documentType": {
            "@id": "kyc-vocab:documentType",
            "@type": "xsd:integer"
          },
          "ZKPexperiance": {
            "@id": "kyc-vocab:hasZKPexperiance",
            "@type": "xsd:boolean"
          },
          "hireDate": {
            "@id": "kyc-vocab:hireDate",
            "@type": "xsd:dateTime"
          },
          "position": {
            "@id": "kyc-vocab:position",
            "@type": "xsd:string"
          },
          "salary": {
            "@id": "kyc-vocab:salary",
            "@type": "xsd:double"
          }
        }
      }
    }
  ]
}
`;

export const testDocumentIPFS = `{
  "id": "https://dev.polygonid.me/api/v1/identities/did:polygonid:polygon:mumbai:2qLPqvayNQz9TA2r5VPxUugoF18teGU583zJ859wfy/claims/eca334b0-0e7d-11ee-889c-0242ac1d0006",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schema.iden3.io/core/jsonld/iden3proofs.jsonld",
    "ipfs://QmeMevwUeD7o6hjfmdaeFD1q4L84hSDiRjeXZLi1bZK1My"
  ],
  "type": [
    "VerifiableCredential",
    "testNewType"
  ],
  "expirationDate": "2030-01-01T00:00:00Z",
  "issuanceDate": "2023-06-19T08:47:29.888363862Z",
  "credentialSubject": {
    "id": "did:polygonid:polygon:mumbai:2qFTXJyiehHC19zLffRc9DYT88LQRViufWJzFSHCqL",
    "testNewTypeInt": 1,
    "type": "testNewType"
  },
  "credentialStatus": {
    "id": "https://dev.polygonid.me/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qLPqvayNQz9TA2r5VPxUugoF18teGU583zJ859wfy/claims/revocation/status/162771772",
    "revocationNonce": 162771772,
    "type": "SparseMerkleTreeProof"
  },
  "issuer": "did:polygonid:polygon:mumbai:2qLPqvayNQz9TA2r5VPxUugoF18teGU583zJ859wfy",
  "credentialSchema": {
    "id": "ipfs://QmQVeb5dkz5ekDqBrYVVxBFQZoCbzamnmMUn9B8twCEgDL",
    "type": "JsonSchemaValidator2018"
  },
  "proof": [
    {
      "type": "BJJSignature2021",
      "issuerData": {
        "id": "did:polygonid:polygon:mumbai:2qLPqvayNQz9TA2r5VPxUugoF18teGU583zJ859wfy",
        "state": {
          "txId": "0xde8c8e234e9e4c159b9ce6361234c15eaaa123bddf15f395489a75e634e11182",
          "blockTimestamp": 1683792462,
          "blockNumber": 35452981,
          "rootOfRoots": "03beaa14074a91698084d2dc077067babb8334584a7d73a047e6b238341b581d",
          "claimsTreeRoot": "a5faef8b1fc67f65c55ad667919e51abfed008ca97475c41b26a5e70fd4c4a0a",
          "revocationTreeRoot": "0000000000000000000000000000000000000000000000000000000000000000",
          "value": "5ab768f8f2ec3f94e6830908fbf428ca3386ff87a5e704fcd1f11cae3420611f"
        },
        "authCoreClaim": "cca3371a6cb1b715004407e325bd993c080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e3b9e422feb1dcf83882b33bddf3c9a64d300e2280e9c286bb75839c824ace27c5560b8ca92be27698a14f6970c32731e73768d74fe83d0fd4f16f14b4402d242dd87d9900000000281cdcdf0200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "mtp": {
          "existence": true,
          "siblings": [
            "16600125203338042323361216512603158366636445287571403125891881295088432028008",
            "11315256355804790111057838658876672619892914293003422319088357823149445991751",
            "5953630948937947438067785504646477838099205855387889079750411149043045455341",
            "7144700925452824210038939338852356191428773494854012082867969138805603048585",
            "3921545027306074721354497759643961758048633515411954472382458013486548057049",
            "0",
            "0",
            "5436254548464410857916946211162171910597645182542037135954554779197265908702"
          ]
        },
        "credentialStatus": {
          "id": "https://dev.polygonid.me/api/v1/identities/did%3Apolygonid%3Apolygon%3Amumbai%3A2qLPqvayNQz9TA2r5VPxUugoF18teGU583zJ859wfy/claims/revocation/status/2575161389",
          "revocationNonce": 2575161389,
          "type": "SparseMerkleTreeProof"
        }
      },
      "coreClaim": "d7939e871529d085f1c549ab8e3484642a000000000000000000000000000000021241e014bc0bed916380369c66daf6a49a2efaafe19b9eead97ecd45fb0f007a4a3b209875d293677af876eb5a00b97739bcff3aef28d677654a4216fe142100000000000000000000000000000000000000000000000000000000000000003cb3b3090000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "signature": "b25559a5b4f56e4279f318440e3f57173046abf46970a34725cc293146cd07af5a1554462d8254f11bea18c0e32969b8e5bb740a74e0f79cf81639c2249b4103"
    },
    {
      "type": "Iden3SparseMerkleTreeProof",
      "issuerData": {
        "id": "did:polygonid:polygon:mumbai:2qLPqvayNQz9TA2r5VPxUugoF18teGU583zJ859wfy",
        "state": {
          "txId": "0xd7acd97658a9fd46fcecc297a2658e87484c4fb158b5cc751fa55cc66a528901",
          "blockTimestamp": 1687164493,
          "blockNumber": 37031106,
          "rootOfRoots": "013157d23e45439d797cf21eff7cce75a62c571eeebbd4bb3fc0f82b938e2725",
          "claimsTreeRoot": "db2b0678c8d26177a6c7b316cac669f1d37baf6e69a9a8f45dd2b0127008a50c",
          "revocationTreeRoot": "2f81358078a2ea3874ce6000994fc57d399b57d2d2239fc0d40e7112409af804",
          "value": "4d997e8bf918046a338da7d3a60fc1a66b9b549718b8391071ca2eef8951492a"
        }
      },
      "coreClaim": "d7939e871529d085f1c549ab8e3484642a000000000000000000000000000000021241e014bc0bed916380369c66daf6a49a2efaafe19b9eead97ecd45fb0f007a4a3b209875d293677af876eb5a00b97739bcff3aef28d677654a4216fe142100000000000000000000000000000000000000000000000000000000000000003cb3b3090000000080d8db700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "mtp": {
        "existence": true,
        "siblings": [
          "7014863375885756478216431089540562731662914991320699716584671851123060599668",
          "21315600889769805398676045356078521059928852692746112705474647520974404948890",
          "21548560938430009683383944561421125979714483097439757511725983865213908705359",
          "20098927269510769492310533561375018705245216008792620555365069905774375917381",
          "7203728335210032481762971413039087279239292151184438299705033616348328560570",
          "0",
          "0",
          "0",
          "0",
          "6742687216537986078187329258797021007707864223416791051080996892176890387669"
        ]
      }
    }
  ]
}`;

export const arr_test = `{
    "@context": [
      {
        "@version": 1.1,
        "@protected": true,
        "id": "@id",
        "type": "@type",
        "CountriesList": {
          "@id": "uuid:urn:87caf7a2-fee3-11ed-be56-0242ac120001",
          "@context": {
            "@propagate": true,
            "@protected": true,
            "polygon-vocab": "uuid:urn:87caf7a2-fee3-11ed-be56-0242ac120002#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "countries": {
              "@id": "polygon-vocab:countries",
              "@context": {
                "code": {
                  "@id": "polygon-vocab:code",
                  "@type": "xsd:integer"
                },
                "name": {
                  "@id": "polygon-vocab:name",
                  "@type": "xsd:string"
                }
              }
            }
          }
        }
      }
    ],
    "@type":"CountriesList",
    "countries": [
      {"code":1 , "name":"abc"},
      {"code":2 , "name":"def"}
    ]
  }`;
