// ESLint "flat config" (the modern format used by ESLint 9+).
// This file tells ESLint how to check your JavaScript for mistakes.
import js from "@eslint/js";
import globals from "globals";

export default [
  // 1) Start from ESLint's recommended rules (catches undefined vars,
  //    duplicate keys, unreachable code, etc.).
  js.configs.recommended,

  // 2) Project-wide settings for our .js files.
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest", // allow the newest JS syntax
      sourceType: "module", // we use import / export
      globals: {
        ...globals.node, // recognise console, process, setTimeout, etc.
      },
    },
    rules: {
      // A few rules that match the Day-1 habits from your training:
      eqeqeq: "error", // always use === and !== (never == / !=)
      "no-var": "error", // never use var — use let / const
      "prefer-const": "warn", // use const when a variable is never reassigned
      "no-unused-vars": "warn", // flag variables you declared but never used
    },
  },

  // 3) Folders ESLint should never look at.
  //    employee-ui is a separate React project with its OWN eslint.config.js,
  //    so we let it lint itself instead of linting it from here.
  {
    ignores: ["node_modules/", "dist/", "**/employee-ui/**"],
  },
];
