import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    documents: ['src/**/*.ts'],
    generates: {
        './schema.graphql': {
            config: {
                includeDirectives: true,
            },
            plugins: ['schema-ast'],
        },
        './src/graphql/': {
            config: {
                documentMode: 'string',
            },
            preset: 'client',
        },
    },
    ignoreNoDocuments: true,
    schema: 'http://localhost:3000/graphql',
}

export default config
