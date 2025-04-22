// @ts-check
import { eslintConfig } from "js-style-kit";

export default eslintConfig(
  {
    ignores: [".next", ".turbo", "next-env.d.ts", "src/generated"],
    jsdoc: false,
    react: {
      framework: "next",
    },
    rules: {
      "perfectionist/sort-imports": [
        "warn",
        {
          internalPattern: ["^@/.+"],
        },
      ],
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
