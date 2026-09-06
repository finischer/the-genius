const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const unusedImports = require("eslint-plugin-unused-imports");
const path = require("path");

module.exports = [
    {
        ignores: [
            "**/node_modules/**",
            "**/public/**",
            "**/build/**",
            "**/dist/**",
            "**/.next/**",
            "src/**/env.mjs",
            "src/examples/**/*",
            "src/generated/**/*"
        ]
    },
    {
        files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "unused-imports": unusedImports,
        },
        rules: {
            ...(typescriptEslint.configs?.recommended?.rules || {}),
            "@typescript-eslint/no-misused-promises": ["error", {
                checksVoidReturn: false,
            }],
            "@typescript-eslint/consistent-type-imports": ["warn", {
                prefer: "type-imports",
                fixStyle: "inline-type-imports",
            }],
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
            }],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
            "@typescript-eslint/ban-ts-ignore": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules: {
            ...(typescriptEslint.configs?.["recommended-requiring-type-checking"]?.rules || {}),
        },
    },
    {
        files: ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
        rules: {
            "@typescript-eslint/unbound-method": "off",
        },
    },
];
