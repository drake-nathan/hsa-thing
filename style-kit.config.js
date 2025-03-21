import { eslintConfig, prettierConfig } from "js-style-kit";

export const eslint = eslintConfig(
  {
    ignores: [".next", ".turbo", "next-env.d.ts"],
    jsdoc: false,
    react: true,
    typescript: "tsconfig.eslint.json",
  },
  {
    rules: {
      "no-nested-ternary": "off",
    },
  },
);

export const prettier = prettierConfig({
  tailwind: "./src/styles/globals.css",
});
