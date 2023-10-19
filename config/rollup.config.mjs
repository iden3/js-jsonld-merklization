import commonJS from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import tsConfig from '../tsconfig.json' assert { type: 'json' };
import packageJson from '../package.json' assert { type: 'json' };
import terser from '@rollup/plugin-terser';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const external = [
  ...Object.keys(packageJson.peerDependencies).filter((key) => key.startsWith('@iden3/'))
];

const replaceModuleLocation = {
  name: 'replaceModuleLocation',
  resolveId(source) {
    if (source === 'n3') {
      // Replace 'module-to-replace' with the new file path
      const newFilePath = resolve(__dirname, '../node_modules/n3/browser/n3.min.js');
      return newFilePath;
    }
    // If not replacing, return null to continue with the default resolution
    return null;
  }
};

const config = {
  input: 'src/index.ts',
  external,
  output: [
    {
      format: 'es',
      file: 'dist/browser/esm/index.js',
      sourcemap: true,
      banner: 'console.log("hello esm world")'
    }
  ],
  plugins: [
    typescript({
      compilerOptions: {
        ...tsConfig.compilerOptions
      }
    }),
    replaceModuleLocation,
    commonJS(),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    terser()
  ],

  treeshake: {
    preset: 'smallest'
  }
};

export default [
  config,
  {
    ...config,
    external: [],
    output: [
      {
        format: 'iife',
        file: 'dist/browser/umd/index.js',
        name: 'Iden3Merklizer',
        sourcemap: true
      }
    ]
  }
];
