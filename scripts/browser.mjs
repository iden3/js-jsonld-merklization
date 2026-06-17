import commonJS from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import packageJson from '../package.json' with { type: 'json' };
import tsConfig from '../tsconfig.json' with { type: 'json' };

const compilerOptions = {
  ...tsConfig.compilerOptions,
  outDir: undefined,
  declarationDir: undefined,
  declaration: undefined,
  sourceMap: undefined,
  declarationMap: undefined
};

const external = [
  ...Object.keys(packageJson.peerDependencies), ...Object.keys(packageJson.dependencies)
];

const config = {
  input: 'src/index.ts',
  external,
  onwarn(warning, warn) {
    // The node polyfill pulls in readable-stream, whose internal modules import
    // each other circularly. These cycles are third-party and harmless, so
    // suppress circular-dependency warnings that originate entirely in
    // node_modules while still surfacing any from our own source.
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      const ids = warning.ids ?? [];
      const fromNodeModules = ids.length
        ? ids.every((id) => id.includes('node_modules'))
        : warning.message.includes('node_modules');
      if (fromNodeModules) {
        return;
      }
    }
    warn(warning);
  },
  output: [
    {
      format: 'es',
      file: 'dist/browser/esm/index.js',
      sourcemap: true
    }
  ],
  plugins: [
    nodePolyfills(),
    json(),
    typescript({
      compilerOptions
    }),
    commonJS(),
    nodeResolve({
      browser: true
    })
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
        sourcemap: true,
        inlineDynamicImports: true
      }
    ]
  }
];
