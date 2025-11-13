/// <reference types="vitest" />
import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

import { envSchema } from './src/shared/config/env'

type ServerConfig = { port: number; open: boolean }

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const rawEnv = loadEnv(mode, process.cwd(), 'VITE_')

    // Parse using schema
    const env = envSchema.parse({
        ENV: rawEnv.VITE_ENV,
        PORT: rawEnv.VITE_PORT,
        BACKEND_PROXY: rawEnv.VITE_BACKEND_PROXY,
        CLERK_PUBLISHABLE_KEY: rawEnv.VITE_CLERK_PUBLISHABLE_KEY
    })

    const serverConfig: ServerConfig = {
        port: env.PORT ? env.PORT : 5173,
        open: false
    }

    return {
        plugins: [react(), tailwindcss()],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/setup-tests.ts',
            include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
            coverage: {
                reporter: ['json', 'html'],
                include: ['src/**/*.{ts,tsx}'],
                exclude: [
                    'src/**/*.d.ts',
                    'src/**/index.{ts,tsx}',
                    'src/**/types.{ts,tsx}',
                    'coverage/**',
                    'node_modules/**',
                    'test/**',
                    'tests/**',
                    'dist/**',
                    'build/**',
                    '**/*.config.{ts,js}',
                    'src/setupTests.ts'
                ],
                thresholds: {
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80
                }
            }
        },
        server: serverConfig,
        preview: serverConfig,
        build: {
            minify: true,
            rollupOptions: {
                external: [/.*\.(test|spec)\.(js|ts|tsx)$/] // Exclude test files from the build
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        }
    }
})
