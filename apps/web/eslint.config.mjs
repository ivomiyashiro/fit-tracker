import createConfig from "@fit-tracker/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default createConfig({
  react: true,
}, {
  plugins: {
    "@tanstack/query": pluginQuery,
  },
  rules: {
    "antfu/top-level-function": "off",
    "@tanstack/query/exhaustive-deps": "error",
    "react-refresh/only-export-components": "off",
    "eslint-comments/no-unlimited-disable": "off",
    "react/no-unstable-default-props": "off",
    "react/prefer-shorthand-boolean": "off",
    "style/indent": "off",
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: ["README.md", "~__root.tsx"],
    }],
  },
});
