import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { parse } from 'dotenv'
import swc from 'unplugin-swc'

// Since this config is extended in NX apps, the relative paths may not work.
// Because of this, we need to convert all relative paths within this base vitest config using this function.
const projectPath = (relativePath: string) => path.join(__dirname, relativePath)

export default defineConfig({
    plugins: [
        tsconfigPaths({ ignoreConfigErrors: true }),
        swc.vite({
            tsconfigFile: projectPath('./tsconfig.base.json'),
        }),
    ],
    test: {
        env: parse(fs.readFileSync(projectPath('.env.test'))),
        // documentation says this should be loaded automatically, but it isn't working
        globals: false,
        include: ['apps/**/*.{test,spec}.ts', 'libs/**/*.{test,spec}.ts'],
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: true,
            },
        },
    },
})
