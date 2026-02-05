import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
      ...pluginReact.configs.flat.recommended.settings,
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/prop-types": "off",
      "no-console": ["error", { allow: ["error"] }],
    },
  },
  {
    // Note: there should be no other properties in this object
    ignores: [
      "node_modules/*",
      "build/*",
      "tmp/*",
      "public/*",
    ],
  },
]);
