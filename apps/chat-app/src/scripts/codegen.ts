import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    documents: './src/**/*.graphql',
    generates: {
        './libs/graphql/types/': {
            preset: 'client-preset',
        },
    },
    ignoreNoDocuments: true,
    schema: './libs/graphql/graphql-schema.graphql',
}

export default config
