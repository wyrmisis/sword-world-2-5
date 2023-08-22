import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import cssImports from "rollup-plugin-import-css";
import { copy } from "@web/rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import eslint from "@rollup/plugin-eslint";

const staticFileFolders = ["lang", "packs", "templates"];

/**
 * Rollup injects an environment variable if watch mode is used.
 * See: https://rollupjs.org/guide/en/#-w--watch
 */
const isWatchMode = !!process.env.ROLLUP_WATCH;

/**
 * @type {import('rollup-plugin-livereload').RollupLivereloadOptions & import('livereload').CreateServerConfig}
 */
const livereloadConfig = {
  delay: 500,
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
      cssImports({
        exclude: ['**/*.module.css']
      }),
      !isWatchMode && terser(),
      copy({
        patterns: staticFileFolders.map((folderName) => `${folderName}/**/*`),
        rootDir: "./src/",
      }),
      isWatchMode && livereload(livereloadConfig),
    ],
  },
  {
    input: "src/components/index.ts",
    output: {
      dir: "dist/",
      format: "es",
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      typescript(),
      !isWatchMode && eslint(),
      cssImports({
        exclude: ['**/*.module.css']
      }),
      !isWatchMode && terser(),
      copy({
        patterns: staticFileFolders.map((folderName) => `${folderName}/**/*`),
        rootDir: "./src/",
      }),
      isWatchMode && livereload(livereloadConfig),
    ],
  }
  
]);
