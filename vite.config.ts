import { defineConfig } from "vite";
import { default as terser } from '@rollup/plugin-terser';
import dts from 'vite-plugin-dts';

export default defineConfig({
    server: {
        
    },
    build: {
        lib: {
            entry: ['src/collection-browser.ts'],
        },
        minify: false,
        copyPublicDir: false,
        rollupOptions: {
            external: [
                '**/*tests.ts',
                '**/*tests.js',
            ],
            output: [
                {
                    dir: 'dist',
                    entryFileNames: 'collection-browser.js',
                    format: 'es',
                },
                {
                    dir: 'dist',
                    entryFileNames: 'collection-browser.min.js',
                    format: 'es',
                    plugins: [terser()]
                },
                {
                    dir: 'dist',
                    name: 'collection-browser.umd.js',
                    entryFileNames: 'collection-browser.umd.js',
                    format: 'umd',
                },
                {
                    dir: 'dist',
                    entryFileNames: 'collection-browser.umd.min.js',
                    name: 'collection-browser.umd.min.js',
                    format: 'umd',
                    plugins: [terser()]
                }
            ]
        }
    },
    plugins: [dts({ exclude: ["**/*.test.ts", 'src/dev'], rollupTypes: true })]
});