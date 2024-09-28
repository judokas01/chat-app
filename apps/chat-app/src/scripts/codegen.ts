import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    documents: ['src/**/*.ts'],
    generates: {
        './libs/graphql/types/': {
            config: {
                documentMode: 'string',
            },
            plugins: ['typed-document-node'],
            preset: 'client',
        },
    },
    ignoreNoDocuments: true,
    schema: './libs/graphql/graphql-schema.graphql',
}

export default config
