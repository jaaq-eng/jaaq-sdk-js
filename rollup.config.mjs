/* eslint-disable no-undef */
import { defineConfig } from 'rollup';
import { config } from '@dotenvx/dotenvx';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const tsConfigPathsPlugin = tsConfigPaths();
const replacePlugin = replace({
  'process.env.JAAQ_API_URL': JSON.stringify(process.env.JAAQ_API_URL),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  preventAssignment: true,
});
const typescriptPlugin = typescript({ tsconfig: './tsconfig.build.json', declaration: false });

function cssAutoInject() {
  const injectedStyles = new Set();
  return {
    name: 'css-auto-inject',
    transform(_, id) {
      if (id.endsWith('.css')) {
        const css = readFileSync(id, 'utf-8');
        const styleId = `jaaq-styles-${id.split('/').pop().replace('.css', '')}`;

        if (!injectedStyles.has(styleId)) {
          injectedStyles.add(styleId);
        }

        return {
          code: `
            (function() {
              if (typeof document !== 'undefined') {
                const styleId = ${JSON.stringify(styleId)};
                if (!document.getElementById(styleId)) {
                  const style = document.createElement('style');
                  style.id = styleId;
                  style.textContent = ${JSON.stringify(css)};
                  document.head.appendChild(style);
                }
              }
            })();
            export default ${JSON.stringify(css)};
          `,
          map: null,
        };
      }
    },
  };
}

function cssAsStringExport() {
  return {
    name: 'css-as-string-export',
    load(id) {
      if (id.endsWith('.css')) {
        try {
          const css = readFileSync(id, 'utf-8');
          return `export default ${JSON.stringify(css)};`;
        } catch (_error) {
          console.error('Error loading CSS file:', _error);
          return null;
        }
      }
      return null;
    },
  };
}

function buildEmbed() {
  return {
    name: 'build-embed',
    writeBundle() {
      const cdnBaseUrl = process.env.JAAQ_CDN_URL;
      if (!cdnBaseUrl) {
        console.warn('⚠ JAAQ_CDN_URL not set, skipping embed.html generation');
        return;
      }

      const embedFiles = ['embed.html', 'embed-collection.html'];
      const outputDir = join(__dirname, 'dist/embed');
      const cdnUrl = `${cdnBaseUrl}/latest`;

      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      embedFiles.forEach((fileName) => {
        const templatePath = join(__dirname, 'src/ui/embed', fileName);
        const outputPath = join(outputDir, fileName);

        if (!existsSync(templatePath)) {
          console.error(`Template file not found: ${templatePath}`);
          return;
        }

        let template = readFileSync(templatePath, 'utf8');
        template = template.replace(/__JAAQ_CDN_URL__/g, cdnUrl);

        writeFileSync(outputPath, template, 'utf8');
        console.log(`✓ Embed HTML written to: ${outputPath} (CDN: ${cdnUrl})`);
      });
    },
  };
}

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
      buildEmbed(),
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
  {
    input: 'src/ui/index.ts',
    external: ['hls.js'],
    output: [
      {
        file: 'dist/ui/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/ui/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      tsConfigPathsPlugin,
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      cssAutoInject(),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.css'] }),
      replacePlugin,
      commonjs(),
    ],
  },
  {
    input: 'src/ui/index.ts',
    external: ['hls.js'],
    output: {
      file: 'dist/ui/jaaq-ui.min.js',
      format: 'umd',
      name: 'JaaqUI',
      sourcemap: true,
      globals: {
        'hls.js': 'Hls',
      },
    },
    plugins: [
      tsConfigPathsPlugin,
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      cssAutoInject(),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.css'] }),
      replacePlugin,
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/ui/index.ts',
    output: {
      file: 'dist/ui/jaaq-ui-bundled.min.js',
      format: 'umd',
      name: 'JaaqUI',
      sourcemap: true,
    },
    plugins: [
      tsConfigPathsPlugin,
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      cssAutoInject(),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.css'] }),
      replacePlugin,
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/ui/index.ts',
    external: ['hls.js', /\.css$/],
    output: {
      file: 'dist/ui/index.d.ts',
      format: 'es',
    },
    plugins: [tsConfigPathsPlugin, dts()],
  },
  {
    input: 'src/ui/react/index.ts',
    external: ['react', 'react-dom', 'hls.js'],
    output: [
      {
        file: 'dist/ui/react/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/ui/react/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      tsConfigPathsPlugin,
      typescript({ tsconfig: './tsconfig.json', declaration: false, jsx: 'react', exclude: ['tests', '**/*.test.ts'] }),
      cssAsStringExport(),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.tsx', '.js', '.css'] }),
      replacePlugin,
      commonjs(),
    ],
  },
  {
    input: 'src/ui/react/index.ts',
    external: ['react', 'react-dom', 'hls.js'],
    output: {
      file: 'dist/ui/react/jaaq-ui-react.min.js',
      format: 'umd',
      name: 'JaaqUIReact',
      sourcemap: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'hls.js': 'Hls',
      },
    },
    plugins: [
      tsConfigPathsPlugin,
      typescript({ tsconfig: './tsconfig.json', declaration: false, jsx: 'react', exclude: ['tests', '**/*.test.ts'] }),
      cssAsStringExport(),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.tsx', '.js', '.css'] }),
      replacePlugin,
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/ui/react/index.ts',
    external: ['react', 'react-dom', 'hls.js', /\.css$/],
    output: {
      file: 'dist/ui/react/index.d.ts',
      format: 'es',
    },
    plugins: [tsConfigPathsPlugin, dts()],
  },
  {
    input: 'src/ui/webcomponents/index.ts',
    external: ['hls.js'],
    output: [
      {
        file: 'dist/ui/webcomponents/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/ui/webcomponents/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      tsConfigPathsPlugin,
      cssAsStringExport(),
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js'] }),
      replacePlugin,
      commonjs(),
    ],
  },
  {
    input: 'src/ui/webcomponents/index.ts',
    external: ['hls.js'],
    output: {
      file: 'dist/ui/webcomponents/jaaq-webcomponents.min.js',
      format: 'umd',
      name: 'JaaqWebComponents',
      sourcemap: true,
      globals: {
        'hls.js': 'Hls',
      },
    },
    plugins: [
      tsConfigPathsPlugin,
      cssAsStringExport(),
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js'] }),
      replacePlugin,
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/ui/webcomponents/index.ts',
    output: {
      file: 'dist/ui/webcomponents/jaaq-webcomponents-bundled.min.js',
      format: 'umd',
      name: 'JaaqWebComponents',
      sourcemap: true,
    },
    plugins: [
      tsConfigPathsPlugin,
      cssAsStringExport(),
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js'] }),
      replacePlugin,
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/ui/webcomponents/index.ts',
    external: ['hls.js', /\.css$/],
    output: {
      file: 'dist/ui/webcomponents/index.d.ts',
      format: 'es',
    },
    plugins: [tsConfigPathsPlugin, dts()],
  },
  {
    input: 'src/ui/vanilla/index.ts',
    external: ['hls.js'],
    output: [
      {
        file: 'dist/ui/vanilla/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/ui/vanilla/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      tsConfigPathsPlugin,
      cssAutoInject(),
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.css'] }),
      replacePlugin,
      commonjs(),
    ],
  },
  {
    input: 'src/ui/vanilla/index.ts',
    external: ['hls.js'],
    output: {
      file: 'dist/ui/vanilla/jaaq-vanilla.min.js',
      format: 'umd',
      name: 'JaaqVanilla',
      sourcemap: true,
      globals: {
        'hls.js': 'Hls',
      },
    },
    plugins: [
      tsConfigPathsPlugin,
      cssAutoInject(),
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.css'] }),
      replacePlugin,
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/ui/vanilla/index.ts',
    output: {
      file: 'dist/ui/vanilla/jaaq-vanilla-bundled.min.js',
      format: 'umd',
      name: 'JaaqVanilla',
      sourcemap: true,
    },
    plugins: [
      tsConfigPathsPlugin,
      cssAutoInject(),
      typescript({ tsconfig: './tsconfig.json', declaration: false, exclude: ['tests', '**/*.test.ts', 'src/ui/react/**/*'] }),
      resolve({ browser: true, preferBuiltins: false, extensions: ['.ts', '.js', '.css'] }),
      replacePlugin,
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/ui/vanilla/index.ts',
    external: ['hls.js', /\.css$/],
    output: {
      file: 'dist/ui/vanilla/index.d.ts',
      format: 'es',
    },
    plugins: [tsConfigPathsPlugin, dts()],
  },
]);
