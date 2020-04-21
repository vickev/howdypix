const prettierRules = {
  "prettier/prettier": ["error"],
  "react/jsx-one-expression-per-line": "off",
  "react/jsx-wrap-multilines": "off",
};

const typescriptAlreadySupportedByTscRules = {
  "no-undef": "off",
  "no-unused-expressions": "off",
  "no-unused-vars": "off",
  "no-useless-constructor": "off",
  "no-shadow": "off",
  "no-use-before-define": "off",
  // Typescript already checks for the PropTypes definition
  "react/prop-types": "off",
  // Handled by prettier
  "react/jsx-indent": "off",
};

const jestRules = {
  "jest/expect-expect": "off",
  "jest/no-test-callback": "off",
};

module.exports = {
  env: {
    node: 1,
  },
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "jest"],
  globals: {
    test: "readonly",
    expect: "readonly",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  parserOptions: {
    project: ["tsconfig.json"],
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
  },
  rules: {
    ...prettierRules,
    ...typescriptAlreadySupportedByTscRules,
    ...jestRules,
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "import/no-nodejs-modules": "off",
    "import/no-namespace": "off",
    "import/prefer-default-export": "off",
    "sort-class-members/sort-class-members": "off",

    // Super useful rule
    "react/jsx-props-no-spreading": "off",

    // I don't see the use of this rule...
    "@typescript-eslint/no-empty-function": "off",

    // =============================================
    // Custom rules to avoid `any` in the codebase...
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",

    // We can disable this rule because we rely on @typescript-eslint/no-unsafe-*
    "@typescript-eslint/no-explicit-any": "off",

    // This rule can be useful, more especially for tests where you need to override fundtions
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    // =============================================

    // @see https://github.com/benmosher/eslint-plugin-import/issues/1615#issuecomment-577500405
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
  overrides: [
    {
      files: "*.spec.ts",
      rules: {
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
