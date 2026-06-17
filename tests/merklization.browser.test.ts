import { describe, expect, it } from 'vitest';
import { Merklizer } from '../src/merklizer';

// Browser-only smoke test: merklization must work fully offline in the browser.
// The @context is inline (no remote URL), so the document loader is never invoked —
// no network, no fs, no IPFS.
const inlineDoc = JSON.stringify({
  '@context': {
    name: 'http://schema.org/name',
    age: {
      '@id': 'http://schema.org/age',
      '@type': 'http://www.w3.org/2001/XMLSchema#integer'
    }
  },
  name: 'Alice',
  age: 30
});

describe('merklization (browser, offline)', () => {
  it('computes a stable Merkle root for an inline-context document', async () => {
    const mz = await Merklizer.merklizeJSONLD(inlineDoc);
    const root = (await mz.root()).hex();
    expect(root).toEqual('33e1406391b43c2285be035495b9b890d4391e00fb72085581e3772112d7c416');
  });
});
