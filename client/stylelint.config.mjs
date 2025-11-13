/** @type {import("stylelint").Config} */
export default {
    extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
    rules: {
        'lightness-notation': 'number',
        'hue-degree-notation': 'number',
        'color-function-notation': 'modern',
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'theme', 'layer', 'custom-variant']
            }
        ],
        'at-rule-no-deprecated': null
    }
}
