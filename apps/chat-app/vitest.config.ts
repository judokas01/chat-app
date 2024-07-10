import { mergeConfig } from 'vite'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import config from '../../vitest.config'

export default mergeConfig(config, {
    test: {
        include: ['src/**/*.{test,spec}.ts'],
    },
})
