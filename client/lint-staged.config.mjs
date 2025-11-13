export default {
    '*.{js,jsx,ts,tsx}': ['pnpm run lint:eslint', 'pnpm run format:check'],
    '*.css': ['pnpm run lint:stylelint', 'pnpm run format:check'],
    '*.{json,md,html,yml,yaml}': ['pnpm run format:check']
}
