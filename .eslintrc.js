module.exports = {
    parserOptions: {
        sourceType: 'module'
    },
    parser: 'babel-eslint',
    env: {
        node: true
    },
    extends: [
        'standard',
        'prettier',
        'prettier/standard',
        'plugin:jest/recommended',
        'plugin:security/recommended'
    ],
    plugins: ['prettier', 'jest', 'security'],
    rules: {
        'promise/catch-or-return': 'error',
        'prettier/prettier': [
            'error',
            {
                'singleQuote': true,
                'semi': false
            }
        ],
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error"
    }
}
