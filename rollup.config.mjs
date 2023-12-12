import { defineConfig } from "rollup";

// shared rollup plugins
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import livereload from "rollup-plugin-livereload";
import eslint from "@rollup/plugin-eslint";

// system rollup plugins
import { copy } from "@web/rollup-plugin-copy";
import postcss from 'rollup-plugin-postcss';
import postcssEnv from 'postcss-preset-env';
import postcssImport from 'postcss-import';

// component module rollup plugins
import cssImports from "rollup-plugin-import-css";

const staticFileFolders = ["lang", "packs", "assets"];

/**
 * Rollup injects an environment variable if watch mode is used.
 * See: https://rollupjs.org/guide/en/#-w--watch
 */
const isWatchMode = !!process.env.ROLLUP_WATCH;

/**
 * @type {import('rollup-plugin-livereload').RollupLivereloadOptions & import('livereload').CreateServerConfig}
 */
const livereloadConfig = {
  delay: 300,
};


/**
 * @TODO: Separate end points for components and application code
 */
export default defineConfig([
  {
    input: "src/system.ts",
    output: {
      dir: "dist/",
      format: "es",
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      typescript(),
      !isWatchMode && eslint(),
      !isWatchMode && terser(),
      copy({
        patterns: [
          ...staticFileFolders.map((folderName) => `${folderName}/**/*`),
          "templates/**/*.hbs"
        ],
        rootDir: "./src/",
      }),
      postcss({
        extract: true,
        plugins: [postcssImport(), postcssEnv()],
      }),
      isWatchMode && livereload(livereloadConfig),
    ],
  },
  {
    input: "src/components/index.ts",
    output: {
      file: 'dist/components.js',
      format: "es",
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      typescript(),
      !isWatchMode && eslint(),
      cssImports(),
      !isWatchMode && terser(),
      isWatchMode && livereload(livereloadConfig),
    ],
  }

]);
