import { replace } from 'esbuild-plugin-replace';
import { Options, defineConfig } from 'tsup';

const defaultOutExtension: Options['outExtension'] = ({ format }) => {
  return {
    js: `.${format}.js`,
  };
};

const defaultEsBuildPlugins: Options['esbuildPlugins'] = [
  replace({
    __DEV__: '(process.env.NODE_ENV!=="production")',
  }),
];

const baseConfig: Options = {
  // Outputs `dist/index.js` and `dist/utils.js`
  entry: {
    index: 'src/index.ts',
    utils: 'src/utils/index.ts',
  },
  sourcemap: false,
  // Clean output directory before each build
  clean: true,
  minify: true,
  splitting: true,
  tsconfig: './tsconfig.build.json',
  dts: true,
  external: ['jotai', 'react', 'react-dom'],
  platform: 'node',
  outExtension: defaultOutExtension,
  esbuildPlugins: defaultEsBuildPlugins,
  // TSUP does not appear to be respecting tsconfig's jsx property
  // See - https://github.com/egoist/tsup/issues/792
  inject: ['./react-shim.js'],
};

const cjsConfig: Options = {
  ...baseConfig,
  format: ['cjs'],
};

const mjsOutExtension: Options['outExtension'] = ({ format }) => {
  return {
    js: `.${format}.mjs`,
  };
};

const mjsEsBuildPlugins: Options['esbuildPlugins'] = [
  replace({
    __DEV__: '((import.meta.env&&import.meta.env.MODE)!=="production")',
  }),
];

const mjsConfig: Options = {
  ...baseConfig,
  format: ['esm'],
  outExtension: mjsOutExtension,
  esbuildPlugins: mjsEsBuildPlugins,
};

export default defineConfig([cjsConfig, mjsConfig]);
