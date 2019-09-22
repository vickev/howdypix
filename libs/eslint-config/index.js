module.exports = {
  extends: ["node", "prettier"],
  parser: "@typescript-eslint/parser",
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
    "import/no-nodejs-modules": [0],
    "import/no-namespace": [0],
    "import/prefer-default-export": [0]
  }
};
