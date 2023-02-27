import { Merklizer } from './../src/lib/merklizer';
import { MerklizationConstants } from './../src/lib/constants';
import { RDFEntry } from './../src/lib/rdf-entry';
import { RDFDataset } from './../src/lib/rdf-dataset';
import {
  credentials_v1,
  credential_v2,
  doc1,
  multigraphDoc,
  multigraphDoc2,
  testDocument
} from './data';
import { Merkletree, verifyProof, InMemoryDB, str2Bytes } from '@iden3/js-merkletree';
import { DEFAULT_HASHER } from '../src/lib/poseidon';
import { Path } from '../src/lib/path';
import { MtValue } from '../src/lib/mt-value';
import path from 'path';
import { Temporal } from 'temporal-polyfill';

describe('tests merkelization', () => {
  it('multigraph TestEntriesFromRDF', async () => {
    const dataset = await RDFDataset.fromDocument(JSON.parse(multigraphDoc2));

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
        123
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
        19960424
      )
    ];

    expect(entries).toEqual(wantEntries);
  });

  it('TestEntriesFromRDF', async () => {
    const dataSet = await RDFDataset.fromDocument(JSON.parse(testDocument));
    const entries = await RDFEntry.fromDataSet(dataSet, DEFAULT_HASHER);
    const wantEntries = [
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/birthDate'
        ]),
        Temporal.Instant.from('1958-07-17T00:00:00.000Z')
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/familyName'
        ]),
        'SMITH'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/gender'
        ]),
        'Male'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/givenName'
        ]),
        'JOHN'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://schema.org/image'
        ]),
        'data:image/png;base64,iVBORw0KGgokJggg=='
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          0
        ]),
        'http://schema.org/Person'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          1
        ]),
        'https://w3id.org/citizenship#PermanentResident'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#birthCountry'
        ]),
        'Bahamas'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#commuterClassification'
        ]),
        'C1'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#lprCategory'
        ]),
        'C09'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#lprNumber'
        ]),
        '999-999-999'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          0,
          'https://w3id.org/citizenship#residentSince'
        ]),
        Temporal.Instant.from('2015-01-01T00:00:00.000Z')
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/birthDate'
        ]),
        Temporal.Instant.from('1958-07-18T00:00:00.000Z')
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/familyName'
        ]),
        'SMITH'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/gender'
        ]),
        'Male'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/givenName'
        ]),
        'JOHN'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://schema.org/image'
        ]),
        'data:image/png;base64,iVBORw0KGgokJggg=='
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          0
        ]),
        'http://schema.org/Person'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          1
        ]),
        'https://w3id.org/citizenship#PermanentResident'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#birthCountry'
        ]),
        'Bahamas'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#commuterClassification'
        ]),
        'C1'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#lprCategory'
        ]),
        'C09'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#lprNumber'
        ]),
        '999-999-999'
      ),
      new RDFEntry(
        new Path([
          'https://www.w3.org/2018/credentials#credentialSubject',
          1,
          'https://w3id.org/citizenship#residentSince'
        ]),
        Temporal.Instant.from('2015-01-01T00:00:00.000Z')
      ),
      new RDFEntry(
        new Path(['http://schema.org/description']),
        'Government of Example Permanent Resident Card.'
      ),
      new RDFEntry(new Path(['http://schema.org/identifier']), 83627465),
      new RDFEntry(new Path(['http://schema.org/name']), 'Permanent Resident Card'),
      new RDFEntry(
        new Path(['http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 0]),
        'https://w3id.org/citizenship#PermanentResidentCard'
      ),
      new RDFEntry(
        new Path(['http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 1]),
        'https://www.w3.org/2018/credentials#VerifiableCredential'
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#credentialSubject', 0]),
        'did:example:b34ca6cd37bbf23'
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#credentialSubject', 1]),
        'did:example:b34ca6cd37bbf24'
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#expirationDate']),
        Temporal.Instant.from('2029-12-03T12:19:52.000Z')
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#issuanceDate']),
        Temporal.Instant.from('2019-12-03T12:19:52.000Z')
      ),
      new RDFEntry(
        new Path(['https://www.w3.org/2018/credentials#issuer']),
        'did:example:489398593'
      )
    ];

    expect(entries).toEqual(wantEntries);
  });

  it('test proof', async () => {
    const dataSet = await RDFDataset.fromDocument(JSON.parse(testDocument));
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

    const ok = await verifyProof(mt.root, p.proof, k, v);

    expect(ok).toBe(true);
  });

  it('TestProofInteger', async () => {
    const dataSet = await RDFDataset.fromDocument(JSON.parse(testDocument));
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

    const ok = await verifyProof(mt.root, p.proof, k, v);

    expect(ok).toBe(true);
  });

  describe('TestMerklizer_Proof', () => {
    it('test Merklizer with path as a Path', async () => {
      const mz = await Merklizer.merklizeJSONLD(testDocument);
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
      const ok = await verifyProof(mz.mt!.root, proof, pathMTEntry, valueMTEntry);
      expect(ok).toBeTruthy();

      expect(mz.root().hex()).toEqual(
        'd001de1d1b74d3b24b394566511da50df18532264c473845ea51e915a588b02a'
      );
    });

    it('test Merklizer with path as shortcut string', async () => {
      const mz = await Merklizer.merklizeJSONLD(testDocument);
      const path = await mz.resolveDocPath('credentialSubject.1.birthCountry');

      const { proof, value } = await mz.proof(path);

      const pathMTEntry = await path.mtEntry();

      expect(value?.isString()).toBeTruthy();
      const valueStr = value?.asString() ?? '';
      expect(valueStr).toEqual('Bahamas');
      expect(valueStr).toBeDefined();
      const valueMTEntry = await MtValue.mkValueMtEntry(DEFAULT_HASHER, valueStr);
      const ok = verifyProof(mz.root(), proof, pathMTEntry, valueMTEntry);
      expect(ok).toBeTruthy();

      expect(mz.root().hex()).toEqual(
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
    const result = await Path.getContextPathKey(credential_v2, typ, fieldPath);
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
    const mz = await Merklizer.merklizeJSONLD(doc1);
    const path = await mz.resolveDocPath('credentialSubject.birthday');

    const wantPath = new Path([
      'https://www.w3.org/2018/credentials#credentialSubject',
      'https://github.com/iden3/claim-schema-vocab/blob/main/credentials/kyc.md#birthday'
    ]);

    expect(wantPath).toEqual(path);

    const { proof, value } = await mz.proof(path);

    expect(proof.existence).toBe(true);
    const i = value?.asNumber();
    expect(i).toEqual(19960424);
  });

  it('TestPathFromDocument', async () => {
    const inp = 'credentialSubject.1.birthDate';
    const result = await Path.fromDocument(null, testDocument, inp);

    const want = new Path([
      'https://www.w3.org/2018/credentials#credentialSubject',
      1,
      'http://schema.org/birthDate'
    ]);

    expect(want).toEqual(result);
  });

  it('TestMerklizer_RawValue', async () => {
    const mz = await Merklizer.merklizeJSONLD(multigraphDoc);

    const path = await Path.fromDocument(null, multigraphDoc, 'verifiableCredential.birthday');

    const val = await mz.rawValue(path);
    expect(val).toEqual(19960425);
  });
});
