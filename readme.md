# JS-JSONLD-MERKLIZATION

*@iden3/js-jsonld-merklization* is a library for merklizing JSON-LD documents in JavaScript. Merklization is a process that creates a Merkle tree of a JSON-LD document, which allows for efficient verification of data integrity and authenticity.

This library uses jsonld.js to serialize JSON-LD documents into a canonical form, which is then hashed using Poseidon hash. The resulting hashes are combined into a Merkle tree, which can be used to verify the integrity of the original JSON-LD document.

## Installation

To use this library, you can install it via npm:

```bash
npm install @iden3/js-jsonld-merklization
```

Alternatively, you can include it in your project via a CDN:

```html
<script src="dist/umd/index.js"></script>
```

## Usage

Here is an example of how to use this library:

```javascript
import { Merkelizer } from '@iden3/js-jsonld-merklization';

const mz = await Merkelizer.merklizeJSONLD(multigraphDoc);

const path = await Path.fromDocument(null, multigraphDoc, 'verifiableCredential.birthday');
```

## Contributing

Contributions to this library are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

## License

This library is licensed under the AGPL-3.0 License. See the [LICENSE](./LICENSE) file for details.
