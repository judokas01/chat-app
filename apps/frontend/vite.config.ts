// / <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

export default defineConfig({
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        emptyOutDir: true,
        outDir: '../../dist/apps/frontend',
        reportCompressedSize: true,
    },

    cacheDir: '../../node_modules/.vite/apps/frontend',

    plugins: [react(), nxViteTsPaths()],

    preview: {
        host: 'localhost',
        port: 4300,
    },

    root: __dirname,

    server: {
        host: 'localhost',
        port: 4200,
    },
})
