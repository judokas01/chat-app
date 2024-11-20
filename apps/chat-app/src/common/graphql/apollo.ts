import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { GQLContext } from '@root/common/graphql/gql.context'

export const apolloModuleAutoSchemaGen = GraphQLModule.forRoot<ApolloDriverConfig>({
    autoSchemaFile: './libs/graphql/graphql-schema.graphql',
    context: ({ res, req: reg }: GQLContext) => ({ reg, res }),
    driver: ApolloDriver,
    installSubscriptionHandlers: true,
    playground: true,
    sortSchema: true,
})

export const apolloModuleUseTypes = GraphQLModule.forRoot<ApolloDriverConfig>({
    context: ({ res, req: reg }: GQLContext) => ({ reg, res }),
    driver: ApolloDriver,
    // includeStacktraceInErrorResponses: true,
    installSubscriptionHandlers: true,
    playground: true,
    sortSchema: true,

    subscriptions: {
        'subscriptions-transport-ws': {
            onConnect: (connectionParams: ConnectionParams) => {
                return {
                    req: {
                        headers: {
                            authorization:
                                connectionParams.Authorization ?? connectionParams.authorization,
                        },
                    },
                }
            },
        },
    },
    typePaths: ['./**/*.graphql'],
})

type ConnectionParams = { Authorization?: string; authorization?: string }
