module.exports = {
  env: {
    node: 1
  },
  extends: ["airbnb", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
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
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    }
  },
  rules: {
    "prettier/prettier": ["error"],
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] }
    ],
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
