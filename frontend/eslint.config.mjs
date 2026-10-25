import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
