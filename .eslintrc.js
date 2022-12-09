module.exports = {
  root: true,
  extends: ["eslint:recommended", "prettier"],
  overrides: [],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
  },
};
