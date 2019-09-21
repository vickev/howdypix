module.exports = {
  extends: ["node", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  globals: {
    test: "readonly",
    expect: "readonly"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    "import/no-nodejs-modules": "off",
    "import/no-namespace": "off",
    "import/prefer-default-export": "off",
    // Already supported by TypeScript
    "no-undef": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "no-useless-constructor": "off",
    "no-shadow": "off",
    "no-use-before-define": "off",
    "sort-class-members/sort-class-members": "off"
  }
};
