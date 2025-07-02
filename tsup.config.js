import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const getDir = (path) => path.split('/').slice(0, -1).join('/');

// Base external dependencies (for Node.js builds)
const baseExternal = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.devDependencies),
  ...Object.keys(packageJson.peerDependencies)
];

const config = {
  entry: ['src/index.ts'],
  platform: 'node',
  dts: false,
  splitting: false,
  sourcemap: true,
  target: ['es2020', 'node18'],
  clean: true,
  external: baseExternal
};

export default defineConfig([
  {
    ...config,
    format: ['esm'],
    outDir: getDir(packageJson.exports['.'].node.import)
  },
  {
    ...config,
    format: ['cjs'],
    outDir: getDir(packageJson.exports['.'].node.require),
    outExtension: () => ({
      '.js': '.cjs'
    })
  },
  {
    ...config,
    format: ['esm'],
    // !NOTE: uncomment if you need to test index.html
    external: [...Object.keys(packageJson.peerDependencies)],
    noExternal: [...Object.keys(packageJson.dependencies)],
    platform: 'browser',
    outDir: getDir(packageJson.exports['.'].browser),
    env: {
      BUILD_BROWSER: true
    }
  },

  {
    ...config,
    format: ['iife'],
    platform: 'browser',
    globalName: 'Iden3Merklizer',
    external: [],
    env: {
      BUILD_BROWSER: true
    },
    minify: true,
    outDir: getDir(packageJson.exports['.'].umd)
  }
]);
