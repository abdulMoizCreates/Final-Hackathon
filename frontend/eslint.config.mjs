import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { createRequire } from "node:module";

/*
 * Flat-config equivalent of the classic scaffold:
 *   extends: ["next/core-web-vitals", "next/typescript"]
 *
 * eslint-config-next@15 loads its dependencies through @rushstack/eslint-patch,
 * which cannot resolve under ESLint 9.39 + flat config loading (the config file
 * is executed via dynamic import / jiti, so the patch's module-parent walk never
 * reaches the ESLint folder). This config resolves the exact same plugin
 * versions eslint-config-next declares in its own package.json — the same way
 * the patch did (require.resolve(name, { paths: [configDir]) }) — and mirrors
 * the rule set so no rules are lost or disabled.
 */

const require = createRequire(import.meta.url);

// Anchor dependency resolution at eslint-config-next's own location, so both
// pnpm (per-package virtual store) and npm (hoisted tree) installs resolve the
// same versions the patch used to lock in.
const configNextDir = path.dirname(require.resolve("eslint-config-next/package.json"));

function loadNextDependency(name) {
  return require(require.resolve(name, { paths: [configNextDir] }));
}

const reactPlugin = loadNextDependency("eslint-plugin-react");
const reactHooksPlugin = loadNextDependency("eslint-plugin-react-hooks");
const jsxAccessibilityPlugin = loadNextDependency("eslint-plugin-jsx-a11y");
const importPlugin = loadNextDependency("eslint-plugin-import");
const nextPlugin = loadNextDependency("@next/eslint-plugin-next");
const typescriptEslint = loadNextDependency("@typescript-eslint/eslint-plugin");
const typescriptEslintParser = loadNextDependency("@typescript-eslint/parser");
const importResolverTypescriptPath = require.resolve("eslint-import-resolver-typescript", {
  paths: [configNextDir],
});
const importResolverNodePath = require.resolve("eslint-import-resolver-node", {
  paths: [configNextDir],
});
const importTypescriptParserPath = require.resolve("@typescript-eslint/parser", {
  paths: [configNextDir],
});
const babelParserForJs = require(
  require.resolve("eslint-config-next/parser.js", { paths: [configNextDir] })
);
const globals = loadNextDependency("globals");

// Rule maps from @next/eslint-plugin-next's "recommended" and "core-web-vitals"
// legacy configs. Rule keys are already namespaced with "@next/next/"; the
// core-web-vitals rule set overrides severities from "recommended".
const nextRecommendedRules = { ...nextPlugin.configs.recommended.rules };
const nextCoreWebVitalsRules = { ...nextPlugin.configs["core-web-vitals"].rules };

// Additional rule tweaks from eslint-config-next/index.js
const nextBaseRuleOverrides = {
  "import/no-anonymous-default-export": "warn",
  "react/no-unknown-property": "off",
  "react/react-in-jsx-scope": "off",
  "react/prop-types": "off",
  "jsx-a11y/alt-text": [
    "warn",
    {
      elements: ["img"],
      img: ["Image"],
    },
  ],
  "jsx-a11y/aria-props": "warn",
  "jsx-a11y/aria-proptypes": "warn",
  "jsx-a11y/aria-unsupported-elements": "warn",
  "jsx-a11y/role-has-required-aria-props": "warn",
  "react/jsx-no-target-blank": "off",
};

const allSourceGlobs = ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"];

export default defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),

  // Base environment (mirrors env: { browser: true, node: true } from legacy config).
  {
    files: allSourceGlobs,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/parsers": {
        [importTypescriptParserPath]: [".ts", ".mts", ".cts", ".tsx", ".d.ts"],
      },
      "import/resolver": {
        [importResolverNodePath]: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        [importResolverTypescriptPath]: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  // plugin:@typescript-eslint/recommended (next/typescript)
  ...typescriptEslint.configs["flat/recommended"],

  // plugin:react-hooks/recommended
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },

  // plugin:react/recommended
  {
    plugins: {
      react: reactPlugin,
    },
    rules: reactPlugin.configs.flat.recommended.rules,
    languageOptions: {
      parserOptions: reactPlugin.configs.flat.recommended.languageOptions?.parserOptions,
    },
  },

  // plugin:@next/next/recommended + core-web-vitals overrides
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextRecommendedRules,
      ...nextCoreWebVitalsRules,
    },
  },

  // eslint-plugin-jsx-a11y/recommended — intentionally NOT extended wholesale:
  // next/core-web-vitals only enables a targeted subset of jsx-a11y rules
  // (aria-props, aria-proptypes, aria-unsupported-elements, alt-text,
  // role-has-required-aria-props) which are declared below.

  // Rule tweaks from eslint-config-next/index.js — this is the complete set of
  // jsx-a11y rules next/core-web-vitals enables, plus plugins registration for
  // import (not registered above) and jsx-a11y.
  {
    plugins: {
      import: importPlugin,
      "jsx-a11y": jsxAccessibilityPlugin,
    },
    rules: nextBaseRuleOverrides,
  },

  // Parsers per language, mirroring eslint-config-next's parser setup:
  // TypeScript files use @typescript-eslint/parser; other files use the
  // Next.js babel parser.
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: typescriptEslintParser,
      sourceType: "module",
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: babelParserForJs,
      sourceType: "module",
      parserOptions: {
        requireConfigFile: false,
        sourceType: "module",
        allowImportExportEverywhere: true,
        babelOptions: {
          presets: ["next/babel"],
          caller: {
            supportsTopLevelAwait: true,
          },
        },
      },
    },
  },
]);
