// @ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    ignores: [".next", ".turbo", "next-env.d.ts"],
    jsdoc: false,
    react: {
      framework: "next",
    },
    storybook: true,
    typescript: "tsconfig.eslint.json",
  },
  {
    files: ["src/env.js"],
    name: "env",
    rules: {
      "perfectionist/sort-objects": "off",
    },
  },
);
