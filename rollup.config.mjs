/* eslint-disable no-undef */
import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';

const tsConfigPathsPlugin = tsConfigPaths();
const replacePlugin = replace({
  'process.env.JAAQ_API_URL': JSON.stringify(process.env.JAAQ_API_URL),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  preventAssignment: true,
});
const typescriptPlugin = typescript({ tsconfig: './tsconfig.json', declaration: false });

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      tsConfigPathsPlugin,
      resolve({ preferBuiltins: true, extensions: ['.ts', '.js'] }),
      typescriptPlugin,
      replacePlugin,
      commonjs(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/jaaq-sdk.min.js',
      format: 'umd',
      name: 'JaaqSDK',
      sourcemap: true,
    },
    plugins: [
      tsConfigPathsPlugin,
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js'] }),
      typescriptPlugin,
      replacePlugin,
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [tsConfigPathsPlugin, dts()],
  },
]);
