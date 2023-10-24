/* eslint-disable no-console */
import { readFile } from 'fs/promises';
import { Merklizer } from './../src/lib/merklizer';
import { MerklizationConstants } from './../src/lib/constants';
import { RDFEntry } from './../src/lib/rdf-entry';
import { RDFDataset } from './../src/lib/rdf-dataset';
import {
  credentials_v1,
  arr_test,
  kycschema_jsonld,
  doc1,
  multigraphDoc,
  multigraphDoc2,
  testDocument,
  nestedFieldDocument,
  docWithDouble,
  vp,
  ipfsDocument,
  kycV102,
  testDocumentIPFS
} from './data';
import { Merkletree, verifyProof, InMemoryDB, str2Bytes } from '@iden3/js-merkletree';
import { DEFAULT_HASHER } from '../src/lib/poseidon';
import { Path } from '../src/lib/path';
import { MtValue } from '../src/lib/mt-value';
import { Temporal } from '@js-temporal/polyfill';
import { TestHasher } from './hasher';
import { poseidon } from '@iden3/js-crypto';
import { normalizeIPFSNodeURL } from '../src/loaders/jsonld-loader';
import customSchemaJSON from './testdata/custom-schema.json';
import { cacheLoader } from './cache';

describe('tests merkelization', () => {
  it('multigraph TestEntriesFromRDF', async () => {
    const dataset = await RDFDataset.fromDocument(JSON.parse(multigraphDoc2), cacheLoader());

    const entries = await RDFEntry.fromDataSet(dataset, DEFAULT_HASHER);

    const wantEntries: RDFEntry[] = [
      new RDFEntry(
        new Path(['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']),
        'https://www.w3.org/2018/credentials#VerifiablePresentation'
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#holder', 0]),
        'http://example.com/holder1'
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#holder', 1]),
        'http://example.com/holder2'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#verifiableCredential',
          0,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
        ]),
        'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/iden3credential-v2.json-ld#Iden3SparseMerkleTreeProof'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#verifiableCredential',
          0,
          'https://github.com/iden3/claim-schema-vocab/blob/main/proofs/Iden3SparseMerkleTreeProof-v2.md#issuerData',
          'https://github.com/iden3/claim-schema-vocab/blob/main/proofs/Iden3SparseMerkleTreeProof-v2.md#state',
          'https://github.com/iden3/claim-schema-vocab/blob/main/proofs/Iden3SparseMerkleTreeProof-v2.md#blockTimestamp'
        ]),
        123n,
        'http://www.w3.org/2001/XMLSchema#integer'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#verifiableCredential',
          1,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
        ]),
        'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld#KYCAgeCredential'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#verifiableCredential',
          1,
          'https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#birthday'
        ]),
        19960424n,
        'http://www.w3.org/2001/XMLSchema#integer'
      )
    ];

    expect(entries).toEqual(wantEntries);
  });

  it('TestEntriesFromRDF', async () => {
    const dataSet = await RDFDataset.fromDocument(JSON.parse(testDocument), cacheLoader());
    const entries = await RDFEntry.fromDataSet(dataSet, DEFAULT_HASHER);
    const wantEntries = [
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/birthDate'
        ]),
        Temporal.Instant.from('1958-07-17T00:00:00.000Z'),
        'http://www.w3.org/2001/XMLSchema#dateTime'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/familyName'
        ]),
        'SMITH',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/gender'
        ]),
        'Male',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/givenName'
        ]),
        'JOHN',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/image'
        ]),
        'data:image/png;base64,iVBORw0KGgokJggg==',
        ''
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          0
        ]),
        'http://schema.org/Person',
        ''
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          1
        ]),
        'https://w3id.org/citizenship#PermanentResident',
        ''
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#birthCountry'
        ]),
        'Bahamas',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#commuterClassification'
        ]),
        'C1',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#lprCategory'
        ]),
        'C09',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#lprNumber'
        ]),
        '999-999-999',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#residentSince'
        ]),
        Temporal.Instant.from('2015-01-01T00:00:00.000Z'),
        'http://www.w3.org/2001/XMLSchema#dateTime'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/birthDate'
        ]),
        Temporal.Instant.from('1958-07-18T00:00:00.000Z'),
        'http://www.w3.org/2001/XMLSchema#dateTime'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/familyName'
        ]),
        'SMITH',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/gender'
        ]),
        'Male',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/givenName'
        ]),
        'JOHN',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/image'
        ]),
        'data:image/png;base64,iVBORw0KGgokJggg==',
        ''
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          0
        ]),
        'http://schema.org/Person',
        ''
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          1
        ]),
        'https://w3id.org/citizenship#PermanentResident',
        ''
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#birthCountry'
        ]),
        'Bahamas',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#commuterClassification'
        ]),
        'C1',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#lprCategory'
        ]),
        'C09',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#lprNumber'
        ]),
        '999-999-999',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#residentSince'
        ]),
        Temporal.Instant.from('2015-01-01T00:00:00.000Z'),
        'http://www.w3.org/2001/XMLSchema#dateTime'
      ),
      new RDFEntry(
        new Path(['http://schema.org/description']),
        'Government of Example Permanent Resident Card.',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path(['http://schema.org/identifier']),
        83627465n,
        'http://www.w3.org/2001/XMLSchema#integer'
      ),
      new RDFEntry(
        new Path(['http://schema.org/name']),
        'Permanent Resident Card',
        'http://www.w3.org/2001/XMLSchema#string'
      ),
      new RDFEntry(
        new Path(['http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 0]),
        'https://w3id.org/citizenship#PermanentResidentCard',
        ''
      ),
      new RDFEntry(
        new Path(['http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 1]),
        'https://www.w3.org/2018/credentials#VerifiableCredential',
        ''
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#credentialSubject', 0]),
        'did:example:b34ca6cd37bbf23',
        ''
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#credentialSubject', 1]),
        'did:example:b34ca6cd37bbf24',
        ''
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#expirationDate']),
        //value: "2029-12-03T12:19:52Z",
        Temporal.Instant.from('2029-12-03T12:19:52.000Z'),
        'http://www.w3.org/2001/XMLSchema#dateTime'
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#issuanceDate']),
        //value: "2019-12-03T12:19:52Z",
        Temporal.Instant.from('2019-12-03T12:19:52.000Z'),
        'http://www.w3.org/2001/XMLSchema#dateTime'
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#issuer']),
        'did:example:489398593',
        ''
      )
    ];

    expect(entries).toEqual(wantEntries);
  });

  it('test proof', async () => {
    const dataSet = await RDFDataset.fromDocument(JSON.parse(testDocument), cacheLoader());
    const entries = await RDFEntry.fromDataSet(dataSet, DEFAULT_HASHER);

    const mt = new Merkletree(new InMemoryDB(str2Bytes('')), true, 40);

    for (const entry of entries) {
      const { k, v } = await entry.getKeyValueMTEntry();
      await mt.add(k, v);
    }

    // [https://www.w3.org/2018/credentials#credentialSubject 1 http://schema.org/birthDate] => 1958-07-18
    const path = new Path([
      'https://www.w3.org/2018/credentials#credentialSubject',
      1,
      'http://schema.org/birthDate'
    ]);

    const birthDate = Temporal.Instant.from('1958-07-18T00:00:00Z');
    const entry = new RDFEntry(path, birthDate);

    const { k, v } = await entry.getKeyValueMTEntry();

    const p = await mt.generateProof(k, undefined);

    const ok = await verifyProof(await mt.root(), p.proof, k, v);

    expect(ok).toBe(true);
  });

  it('TestProofInteger', async () => {
    const dataSet = await RDFDataset.fromDocument(JSON.parse(testDocument), cacheLoader());
    const entries = await RDFEntry.fromDataSet(dataSet, DEFAULT_HASHER);
    const mt = new Merkletree(new InMemoryDB(str2Bytes('')), true, 40);

    for (const entry of entries) {
      const { k, v } = await entry.getKeyValueMTEntry();
      await mt.add(k, v);
    }

    const path = new Path(['http://schema.org/identifier']);

    const entry = new RDFEntry(path, 83627465);

    const { k, v } = await entry.getKeyValueMTEntry();

    const p = await mt.generateProof(k, undefined);

    const ok = await verifyProof(await mt.root(), p.proof, k, v);

    expect(ok).toBe(true);
  });

  it('TestTypeIDFromContext', async () => {
    const testCases = [
      {
        data: kycschema_jsonld,
        typeName: 'KYCCountryOfResidenceCredential',
        expectedType:
          'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.json-ld#KYCCountryOfResidenceCredential'
      },
      {
        data: kycV102,
        typeName: 'KYCCountryOfResidenceCredential',
        expectedType: 'urn:uuid:a81d4fae-7dec-11d0-a765-00a0c91e6bf0'
      }
    ];

    for (const testCase of testCases) {
      const typeId = await Path.getTypeIDFromContext(testCase.data, testCase.typeName);
      expect(typeId).toEqual(testCase.expectedType);
    }
  });

  describe('TestMerklizer_Proof', () => {
    it('test Merklizer with path as a Path', async () => {
      const mz = await Merklizer.merklizeJSONLD(testDocument, { documentLoader: cacheLoader() });
      const path = new Path([
        'https://www.w3.org/2018/credentials#credentialSubject',
        1,
        'http://schema.org/birthDate'
      ]);
      const { proof, value } = await mz.proof(path);

      const pathMTEntry = await path.mtEntry();

      const valueD = value?.asTime() ?? Temporal.Now.instant();
      expect(valueD).toBeInstanceOf(Temporal.Instant);

      const birthDate = new Date(Date.UTC(1958, 6, 18, 0, 0, 0, 0));
      expect(birthDate.getTime()).toEqual(valueD.epochMilliseconds);

      const valueMTEntry = await MtValue.mkValueMtEntry(DEFAULT_HASHER, valueD);
      if (!mz.mt) {
        throw new Error("can't hash mt entry ");
      }
      const ok = await verifyProof(await mz.mt.root(), proof, pathMTEntry, valueMTEntry);
      expect(ok).toBeTruthy();

      expect((await mz.root()).hex()).toEqual(
        'd001de1d1b74d3b24b394566511da50df18532264c473845ea51e915a588b02a'
      );
    });

    it('test Merklizer with path as shortcut string', async () => {
      const mz = await Merklizer.merklizeJSONLD(testDocument, { documentLoader: cacheLoader() });
      const path = await mz.resolveDocPath('credentialSubject.1.birthCountry', {
        documentLoader: cacheLoader()
      });

      const { proof, value } = await mz.proof(path);

      const pathMTEntry = await path.mtEntry();

      expect(value?.isString()).toBeTruthy();
      const valueStr = value?.asString() ?? '';
      expect(valueStr).toEqual('Bahamas');
      expect(valueStr).toBeDefined();
      const valueMTEntry = await MtValue.mkValueMtEntry(DEFAULT_HASHER, valueStr);
      const ok = verifyProof(await mz.root(), proof, pathMTEntry, valueMTEntry);
      expect(ok).toBeTruthy();

      expect((await mz.root()).hex()).toEqual(
        'd001de1d1b74d3b24b394566511da50df18532264c473845ea51e915a588b02a'
      );
    });
  });

  it('TestPathFromContext', async () => {
    const input = 'VerifiableCredential.credentialSchema.JsonSchemaValidator2018';
    const result = await Path.newPathFromCtx(credentials_v1, input);

    const want = new Path([
      'https://www.w3.org/2018/credentials#VerifiableCredential',
      'https://www.w3.org/2018/credentials#credentialSchema',
      'https://www.w3.org/2018/credentials#JsonSchemaValidator2018'
    ]);

    expect(want).toEqual(result);
  });

  it('TestMkValueInt', async () => {
    const testCases = [
      {
        input: -1,
        want: '21888242871839275222246405745257275088548364400416034343698204186575808495616'
      },
      {
        input: -2,
        want: '21888242871839275222246405745257275088548364400416034343698204186575808495615'
      },
      {
        // math.MinInt64 in golang implementation
        input: -9223372036854775808,
        want: '21888242871839275222246405745257275088548364400416034343688980814538953719809'
      }
    ];

    for (const tc of testCases) {
      const result = await MtValue.mkValueInt(DEFAULT_HASHER, tc.input);
      expect(result.toString()).toEqual(tc.want.toString());
    }
  });

  it('TestFieldPathFromContext', async () => {
    const typ = 'KYCAgeCredential';
    const fieldPath = 'birthday';
    const result = await Path.getContextPathKey(kycschema_jsonld, typ, fieldPath);
    const want = new Path([
      'https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#birthday'
    ]);

    expect(want).toEqual(result);
  });

  it('TestValue', () => {
    // bool
    const v = new MtValue(true);
    expect(false).toEqual(v.isString());
    expect(true).toEqual(v.isBool());
    expect(false).toEqual(v.isNumber());
    expect(false).toEqual(v.isTime());
    const b = v.asBool();
    expect(true).toEqual(b);
    expect(() => v.asString()).toThrowError(MerklizationConstants.ERRORS.MT_VALUE_INCORRECT_TYPE);

    // string
    const s = new MtValue('str');
    expect(true).toEqual(s.isString());
    expect(false).toEqual(s.isBool());
    expect(false).toEqual(s.isNumber());
    expect(false).toEqual(s.isTime());
    const s2 = s.asString();
    expect('str').toEqual(s2);
    expect(() => s.asNumber()).toThrowError(MerklizationConstants.ERRORS.MT_VALUE_INCORRECT_TYPE);

    // string
    const i = new MtValue(3);
    expect(false).toEqual(i.isString());
    expect(false).toEqual(i.isBool());
    expect(true).toEqual(i.isNumber());
    expect(false).toEqual(i.isTime());
    const i2 = i.asNumber();
    expect(3).toEqual(i2);
    expect(() => i.asTime()).toThrowError(MerklizationConstants.ERRORS.MT_VALUE_INCORRECT_TYPE);

    // time.Time
    const tm = new Date(Date.UTC(2022, 10, 20, 3, 4, 5, 6));
    const tm2 = new MtValue(Temporal.Instant.from(tm.toISOString()));
    expect(false).toEqual(tm2.isString());
    expect(false).toEqual(tm2.isBool());
    expect(false).toEqual(tm2.isNumber());
    expect(true).toEqual(tm2.isTime());
    const tm3 = tm2.asTime();
    expect(tm3.toString()).toEqual(tm.toISOString());
    expect(() => tm2.asBool()).toThrowError(MerklizationConstants.ERRORS.MT_VALUE_INCORRECT_TYPE);
  });

  it('TestExistenceProof', async () => {
    const mz = await Merklizer.merklizeJSONLD(doc1, { documentLoader: cacheLoader() });
    const path = await mz.resolveDocPath('credentialSubject.birthday', {
      documentLoader: cacheLoader()
    });

    const wantPath = new Path([
      'https://www.w3.org/2018/credentials#credentialSubject',
      'https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#birthday'
    ]);

    expect(wantPath).toEqual(path);

    const { proof, value } = await mz.proof(path);

    expect(proof.existence).toBe(true);
    const i = value?.asBigInt();
    expect(i).toEqual(19960424n);
  });

  it('TestArrayMerklization', async () => {
    const mz = await Merklizer.merklizeJSONLD(arr_test, { documentLoader: cacheLoader() });

    const expectedPath = new Path([
      'uuid:urn:87caf7a2-fee3-11ed-be56-0242ac120002#countries',
      0,
      'uuid:urn:87caf7a2-fee3-11ed-be56-0242ac120002#code'
    ]);

    const mtProofEntry1 = await mz.proof(expectedPath);

    expect(mtProofEntry1.proof.existence).toBe(true);
    const i = mtProofEntry1.value?.asBigInt();
    expect(i).toEqual(1n);

    const expectedPath2 = new Path([
      'uuid:urn:87caf7a2-fee3-11ed-be56-0242ac120002#countries',
      1,
      'uuid:urn:87caf7a2-fee3-11ed-be56-0242ac120002#code'
    ]);

    const mtEntryProof2 = await mz.proof(expectedPath2);

    expect(mtEntryProof2.proof.existence).toBe(true);
    const v = mtEntryProof2.value?.asBigInt();
    expect(v).toEqual(2n);
  });

  it('TestPathFromDocument', async () => {
    const inp = 'credentialSubject.1.birthDate';
    const result = await Path.fromDocument(null, testDocument, inp, {
      documentLoader: cacheLoader()
    });

    const want = new Path([
      'https://www.w3.org/2018/credentials#credentialSubject',
      1,
      'http://schema.org/birthDate'
    ]);

    expect(want).toEqual(result);
  });

  it('TestPathFromDocument - path to nested field', async () => {
    const inp = 'objectField.customNestedField';
    const result = await Path.fromDocument(null, nestedFieldDocument, inp, {
      documentLoader: cacheLoader()
    });

    const want = new Path([
      'urn:uuid:87caf7a2-fee3-11ed-be56-0242ac120001#objectField',
      'urn:uuid:87caf7a2-fee3-11ed-be56-0242ac120001#customNestedField'
    ]);

    expect(want).toEqual(result);
  });

  it('TestMerklizer_RawValue', async () => {
    const mz = await Merklizer.merklizeJSONLD(multigraphDoc, { documentLoader: cacheLoader() });

    const path = await Path.fromDocument(null, multigraphDoc, 'verifiableCredential.birthday', {
      documentLoader: cacheLoader()
    });

    const val = await mz.rawValue(path);
    expect(val).toEqual(19960425);
  });

  it('TestTypeFromContext', async () => {
    const input = 'KYCAgeCredential.birthday';
    const typ = await Path.newTypeFromContext(kycschema_jsonld, input);
    expect(typ).toEqual('http://www.w3.org/2001/XMLSchema#integer');
  });

  it('TestHashValueFromDocument', async () => {
    const jsonStr = JSON.stringify(customSchemaJSON);
    const testCases = [
      {
        name: 'xsd:integer',
        pathToField: 'KYCEmployee.documentType',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: 1,
        wantHash: '1'
      },
      {
        name: 'xsd:boolean true',
        pathToField: 'KYCEmployee.ZKPexperiance',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: true,
        wantHash: '18586133768512220936620570745912940619677854269274689475585506675881198879027'
      },
      {
        name: 'xsd:boolean false',
        pathToField: 'KYCEmployee.ZKPexperiance',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: false,
        wantHash: '19014214495641488759237505126948346942972912379615652741039992445865937985820'
      },
      {
        name: 'xsd:boolean 1',
        pathToField: 'KYCEmployee.ZKPexperiance',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: '1',
        wantHash: '18586133768512220936620570745912940619677854269274689475585506675881198879027'
      },
      {
        name: 'xsd:boolean 0',
        pathToField: 'KYCEmployee.ZKPexperiance',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: '0',
        wantHash: '19014214495641488759237505126948346942972912379615652741039992445865937985820'
      },
      {
        name: 'xsd:dateTime > January 1st, 1970 RFC3339Nano',
        pathToField: 'KYCEmployee.hireDate',
        datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
        value: '2019-01-01T00:00:00Z',
        wantHash: '1546300800000000000'
      },
      {
        name: 'xsd:dateTime < January 1st, 1970 RFC3339Nano',
        pathToField: 'KYCEmployee.hireDate',
        datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
        value: '1960-02-20T11:20:33Z',
        wantHash: '21888242871839275222246405745257275088548364400416034343697892928208808495617'
      },
      {
        name: 'xsd:dateTime YYYY-MM-DD go format (2006-01-02)',
        pathToField: 'KYCEmployee.hireDate',
        datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
        value: '1997-04-16',
        wantHash: '861148800000000000'
      },
      {
        name: 'xsd:string',
        pathToField: 'KYCEmployee.position',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        value: 'SSI Consultant',
        wantHash: '957410455271905675920624030785024750144198809104092676617070098470852489834'
      },
      {
        name: 'xsd:double should be processed as string',
        pathToField: 'KYCEmployee.salary',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        value: 100000.01,
        wantHash: '7858939477831965477428998013961435925262790627337131132863073454519451718017'
      },
      {
        name: 'xsd:double in our case will be processed as string, since rules are not defined',
        pathToField: 'KYCEmployee.salary',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        value: '100000.01',
        wantHash: '7858939477831965477428998013961435925262790627337131132863073454519451718017'
      },
      {
        name: 'big float64 should be correctly parsed as integer',
        pathToField: 'KYCCountryOfResidenceCredential.countryCode',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: 19960424,
        wantHash: '19960424'
      },
      {
        name: 'max value for positive integer',
        ctxJSON: jsonStr,
        pathToField: 'TestType1.positiveNumber',
        datatype: 'http://www.w3.org/2001/XMLSchema#positiveInteger',
        value: '21888242871839275222246405745257275088548364400416034343698204186575808495616',
        wantHash: '21888242871839275222246405745257275088548364400416034343698204186575808495616'
      },
      {
        name: 'max value for positive integer - too large error',
        ctxJSON: jsonStr,
        pathToField: 'TestType1.positiveNumber',
        datatype: 'http://www.w3.org/2001/XMLSchema#positiveInteger',
        value: '21888242871839275222246405745257275088548364400416034343698204186575808495617',
        wantHashErr:
          'integer exceeds maximum value: 21888242871839275222246405745257275088548364400416034343698204186575808495617'
      },
      {
        name: 'max value for positive integer - negative error',
        ctxJSON: jsonStr,
        pathToField: 'TestType1.positiveNumber',
        datatype: 'http://www.w3.org/2001/XMLSchema#positiveInteger',
        value: '-100500',
        wantHashErr: 'integer is below minimum value: -100500'
      },
      {
        name: 'max value for integer',
        pathToField: 'KYCCountryOfResidenceCredential.countryCode',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: '10944121435919637611123202872628637544274182200208017171849102093287904247808',
        wantHash: '10944121435919637611123202872628637544274182200208017171849102093287904247808'
      },
      {
        name: 'max value for integer - too large error',
        pathToField: 'KYCCountryOfResidenceCredential.countryCode',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: '10944121435919637611123202872628637544274182200208017171849102093287904247809',
        wantHashErr:
          'integer exceeds maximum value: 10944121435919637611123202872628637544274182200208017171849102093287904247809'
      },
      {
        name: 'max value for integer - -1',
        pathToField: 'KYCCountryOfResidenceCredential.countryCode',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: '-1',
        wantHash: '21888242871839275222246405745257275088548364400416034343698204186575808495616'
      },
      {
        name: 'max value for integer - minimum value',
        pathToField: 'KYCCountryOfResidenceCredential.countryCode',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: '-10944121435919637611123202872628637544274182200208017171849102093287904247808',
        wantHash: '10944121435919637611123202872628637544274182200208017171849102093287904247809'
      },
      {
        name: 'max value for integer - too small error',
        pathToField: 'KYCCountryOfResidenceCredential.countryCode',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: '-10944121435919637611123202872628637544274182200208017171849102093287904247809',
        wantHashErr:
          'integer is below minimum value: -10944121435919637611123202872628637544274182200208017171849102093287904247809'
      }
    ];

    for (const tc of testCases) {
      const ldContext = tc.ctxJSON ?? kycschema_jsonld;

      const typ = await Path.newTypeFromContext(ldContext, tc.pathToField);
      expect(typ).toEqual(tc.datatype);
      if (tc.wantHashErr) {
        await expect(Merklizer.hashValue(typ, tc.value)).rejects.toThrow(tc.wantHashErr);
      } else {
        const result = await Merklizer.hashValue(tc.datatype, tc.value);
        expect(result.toString()).toEqual(tc.wantHash?.toString());
      }
    }
  });

  it('TestHashValue', async () => {
    const testCases = [
      {
        name: 'xsd:integer',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: 1,
        wantHash: '1'
      },
      {
        name: 'xsd:boolean true',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: true,
        wantHash: '18586133768512220936620570745912940619677854269274689475585506675881198879027'
      },
      {
        name: 'xsd:boolean false',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: false,
        wantHash: '19014214495641488759237505126948346942972912379615652741039992445865937985820'
      },
      {
        name: 'xsd:boolean 1',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: '1',
        wantHash: '18586133768512220936620570745912940619677854269274689475585506675881198879027'
      },
      {
        name: 'xsd:boolean 0',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: '0',
        wantHash: '19014214495641488759237505126948346942972912379615652741039992445865937985820'
      },
      {
        name: 'xsd:dateTime > January 1st, 1970 RFC3339Nano',
        datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
        value: '2019-01-01T00:00:00Z',
        wantHash: '1546300800000000000'
      },
      {
        name: 'xsd:dateTime < January 1st, 1970 RFC3339Nano',
        datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
        value: '1960-02-20T11:20:33Z',
        wantHash: '21888242871839275222246405745257275088548364400416034343697892928208808495617'
      },
      {
        name: 'xsd:dateTime YYYY-MM-DD go format (2006-01-02)',
        datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
        value: '1997-04-16',
        wantHash: '861148800000000000'
      },
      {
        name: 'xsd:string',
        datatype: 'http://www.w3.org/2001/XMLSchema#string',
        value: 'SSI Consultant',
        wantHash: '957410455271905675920624030785024750144198809104092676617070098470852489834'
      },
      {
        name: 'xsd:double should be processed as string',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        value: 100000.01,
        wantHash: '7858939477831965477428998013961435925262790627337131132863073454519451718017'
      },
      {
        name: 'xsd:double in our case will be processed as string, since rules are not defined',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        value: '100000.01',
        wantHash: '7858939477831965477428998013961435925262790627337131132863073454519451718017'
      },
      {
        name: 'xsd:integer should be correctly parsed as integer',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: 19960424,
        wantHash: '19960424'
      },
      {
        name: 'number with double xsd type should be correctly parsed as string',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        value: 19960424,
        // hash of "1.9960424E7"
        wantHash: '14659279547748882579324236944917252187779632081828519649786308744097131655268'
      },
      {
        name: 'number with double xsd type should be correctly parsed as string',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        value: 19960424,
        wantHash: strHash('1.9960424E7')
      },

      {
        name: 'near to max int64 that may be hashed',
        datatype: 'http://www.w3.org/2001/XMLSchema#double',
        value: 1234567890123456,
        wantHash: strHash('1.234567890123456E15')
      },
      {
        name: 'xsd:dateTime in the distant future',
        datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
        value: '4000-01-01T00:00:00Z',
        wantHash: '64060588800000000000'
      }
    ];

    for (const tc of testCases) {
      const result = await Merklizer.hashValue(tc.datatype, tc.value);
      expect(result.toString()).toEqual(tc.wantHash.toString());
    }
  });

  it('TestHashValueError', async () => {
    const testCases = [
      {
        name: 'xsd:boolean invalid value',
        pathToField: 'KYCEmployee.ZKPexperiance',
        datatype: 'http://www.w3.org/2001/XMLSchema#boolean',
        value: 'True',
        wantErr: 'incorrect boolean value'
      },
      {
        name: 'xsd:integer invalid value',
        pathToField: 'KYCEmployee.documentType',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: 'one',
        wantErr: 'Cannot convert one to a BigInt'
      },
      {
        name: 'xsd:dateTime invalid format MM-DD-YYYY go format (01-02-2006)',
        pathToField: 'KYCEmployee.hireDate',
        datatype: 'http://www.w3.org/2001/XMLSchema#dateTime',
        value: '01-01-2019',
        wantErr: 'invalid ISO 8601 string: 01-01-2019'
      },
      {
        name: 'unknown datatype',
        pathToField: 'KYCEmployee.documentType',
        datatype: 'http://www.w3.org/2001/XMLSchema#integer',
        value: { some_prop: 'some_value' },
        wantErr: 'unsupported type'
      }
    ];

    for (const tc of testCases) {
      await expect(Merklizer.hashValue(tc.datatype, tc.value)).rejects.toThrow(tc.wantErr);
    }
  });

  it('TestHashValueWithCustomHasher', async () => {
    const testPresentationDoc = `
    {
      "id": "uuid:presentation:12312",
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://raw.githubusercontent.com/demonsh/schema/main/jsonld/presentation.json-ld#Presentation"
      ],
      "type": [
        "VerifiableCredential"
      ],
      "expirationDate": "2024-03-08T22:02:16Z",
      "issuanceDate": "2023-03-08T22:02:16Z",
      "issuer": "did:pkh:eip155:1:0x1e903ddDFf29f13fC62F3c78c5b5622a3b14752c",
      "credentialSubject": {
        "id": "did:pkh:eip155:1:0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "score": 64,
        "type": "Presentation"
      }
    }`;

    const mz = await Merklizer.merklizeJSONLD(testPresentationDoc, {
      hasher: new TestHasher(),
      documentLoader: cacheLoader()
    });

    const p = await mz.resolveDocPath('credentialSubject', { documentLoader: cacheLoader() });

    const { proof, value } = await mz.proof(p);

    expect(proof.existence).toEqual(true);

    const value1 = await value?.mtEntry();
    expect(value1).not.toBeNull();
    expect(value1?.toString()).toEqual(
      '6297999125319810690293316740165599291730656617454026745496759658030130583296'
    );
  });

  it('check roots', async () => {
    const testPresentationDoc = {
      id: 'uuid:presentation:12312',
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://raw.githubusercontent.com/demonsh/schema/main/jsonld/presentation.json-ld#Presentation'
      ],
      type: ['VerifiableCredential'],
      expirationDate: undefined,
      issuanceDate: '2023-03-08T22:02:16Z',
      issuer: 'did:pkh:eip155:1:0x1e903ddDFf29f13fC62F3c78c5b5622a3b14752c',
      credentialSubject: {
        id: 'did:pkh:eip155:1:0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        score: 64,
        type: 'Presentation'
      }
    };

    const mz = await Merklizer.merklizeJSONLD(JSON.stringify(testPresentationDoc), {
      documentLoader: cacheLoader()
    });

    const testPresentationDoc2 = {
      id: 'uuid:presentation:12312',
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://raw.githubusercontent.com/demonsh/schema/main/jsonld/presentation.json-ld#Presentation'
      ],
      type: ['VerifiableCredential'],
      issuanceDate: '2023-03-08T22:02:16Z',
      issuer: 'did:pkh:eip155:1:0x1e903ddDFf29f13fC62F3c78c5b5622a3b14752c',
      credentialSubject: {
        id: 'did:pkh:eip155:1:0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        score: 64,
        type: 'Presentation'
      }
    };

    const mz2 = await Merklizer.merklizeJSONLD(JSON.stringify(testPresentationDoc2), {
      documentLoader: cacheLoader()
    });
    expect((await mz.root()).toString()).toEqual((await mz2.root()).toString());
  });

  it('xsd:dateTime', async () => {
    const mz = await Merklizer.merklizeJSONLD(testDocument, { documentLoader: cacheLoader() });

    const path = new Path([
      'https://www.w3.org/2018/credentials#credentialSubject',
      1,
      'http://schema.org/birthDate'
    ]);

    const datatype = await mz.jsonLDType(path);
    expect('http://www.w3.org/2001/XMLSchema#dateTime').toEqual(datatype);
  });

  it('empty datatype', async () => {
    const mz = await Merklizer.merklizeJSONLD(testDocument, { documentLoader: cacheLoader() });

    const path = new Path([
      'https://www.w3.org/2018/credentials#credentialSubject',
      0,
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      0
    ]);

    const datatype = await mz.jsonLDType(path);
    expect('').toEqual(datatype);
  });

  it('roots', async () => {
    const testCases = [
      {
        name: 'testDocument',
        doc: testDocument,
        wantRoot: '19309047812100087948241250053335720576191969395309912987389452441269932261840'
      },
      {
        name: 'doc1',
        doc: doc1,
        wantRoot: '14254126130605812747518773069191924472136034086074656038330159471066163388520'
      },
      {
        name: 'multigraphDoc2',
        doc: multigraphDoc2,
        wantRoot: '11252837464697009054213269776498742372491493851016505396927630745348533726396'
      },
      {
        name: 'vp',
        doc: vp,
        wantRoot: '438107724194342316220762948074408676879297288866380839121721382436955105096'
      },
      {
        name: 'docWithFloat',
        doc: docWithDouble,
        wantRoot: '16807151140873243281836480228059250043791482248223749610516824774207131149216'
      }
    ];

    for (const tc of testCases) {
      const result = await Merklizer.merklizeJSONLD(tc.doc, { documentLoader: cacheLoader() });
      const root = await result.root();
      expect(root.bigInt().toString()).toEqual(tc.wantRoot.toString());
    }
  });
});

describe('merklize document with ipfs context', () => {
  // node --experimental-vm-modules node_modules/jest/bin/jest.js -t 'set kubo client' tests/merklization.test.ts

  const ipfsNodeURL = process.env.IPFS_URL ?? null;
  if (!ipfsNodeURL) {
    throw new Error('IPFS_URL is not set, skipping IPFS Node test');
  }

  beforeAll(async () => {
    await pushSchemasToIPFS(ipfsNodeURL);
  });

  it('ipfsNodeURL is set', async () => {
    const opts = {
      documentLoader: cacheLoader({
        ipfsNodeURL
      })
    };

    const mz: Merklizer = await Merklizer.merklizeJSONLD(ipfsDocument, opts);
    expect((await mz.root()).bigInt().toString()).toEqual(
      '19309047812100087948241250053335720576191969395309912987389452441269932261840'
    );
  });

  it('ipfsGatewayURL is set', async () => {
    const opts = {
      documentLoader: cacheLoader({
        ipfsNodeURL
      })
    };
    const mz: Merklizer = await Merklizer.merklizeJSONLD(ipfsDocument, opts);
    expect((await mz.root()).bigInt().toString()).toEqual(
      '19309047812100087948241250053335720576191969395309912987389452441269932261840'
    );
  });

  it('IPFS is not configured', async () => {
    await expect(
      Merklizer.merklizeJSONLD(ipfsDocument, { documentLoader: cacheLoader() })
    ).rejects.toThrow('Dereferencing a URL did not result in a valid JSON-LD object');
  });

  it('TestExistenceProofIPFS', async () => {
    const opts = {
      documentLoader: cacheLoader({
        ipfsGatewayURL: 'https://ipfs.io'
      })
    };
    const mz = await Merklizer.merklizeJSONLD(testDocumentIPFS, opts);
    const path = await mz.resolveDocPath('credentialSubject.testNewTypeInt', opts);
    const wantPath = new Path([
      'https://www.w3.org/2018/credentials#credentialSubject',
      'urn:uuid:0a8092e3-7100-4068-ba67-fae502cc6e7b#testNewTypeInt'
    ]);

    expect(wantPath).toEqual(path);
    const { proof, value } = await mz.proof(path);
    expect(proof.existence).toBe(true);

    const i = value?.asBigInt();
    expect(1n).toEqual(i);
  });
});

async function pushSchemasToIPFS(ipfsNodeURL: string): Promise<void> {
  const citizenshipData = await readFile('tests/testdata/citizenship-v1.jsonld');
  const bbsData = await readFile('tests/testdata/dir1/dir2/bbs-v2.jsonld');
  const formData = new FormData();
  formData.append(
    'file',
    new Blob([citizenshipData], { type: 'application/octet-stream' }),
    'citizenship-v1.jsonld'
  );
  formData.append(
    'file',
    new Blob([bbsData], { type: 'application/octet-stream' }),
    'dir1/dir2/bbs-v2.jsonld'
  );
  let url: string | URL = normalizeIPFSNodeURL(ipfsNodeURL, 'add');
  url = new URL(url);
  let headers = {};
  if (url.username && url.password) {
    headers = {
      authorization: `Basic ${btoa(url.username + ':' + url.password)}`
    };
    url.username = '';
    url.password = '';
  }
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    headers
  });
  const resBody = await res.text();
  const records = resBody
    .split('\n')
    .filter((l) => l.trim().length > 0)
    .map((l) => JSON.parse(l).Hash);
  // Check that URLs from ipfsDocument are uploaded to IPFS
  expect(records).toContain('QmdP4MZkESEabRVB322r2xWm7TCi7LueMNWMJawYmSy7hp');
  expect(records).toContain('Qmbp4kwoHULnmK71abrxdksjPH5sAjxSAXU5PEp2XRMFNw');
}

function strHash(str: string): string {
  return poseidon.hashBytes(new TextEncoder().encode(str)).toString();
}
