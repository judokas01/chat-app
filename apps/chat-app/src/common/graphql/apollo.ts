import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { GQLContext } from '@root/common/graphql/gql.context'

export const apolloModuleAutoSchemaGen = GraphQLModule.forRoot<ApolloDriverConfig>({
    autoSchemaFile: './libs/graphql/graphql-schema.graphql',
    context: ({ res, reg }: GQLContext) => ({ reg, res }),
    driver: ApolloDriver,
    installSubscriptionHandlers: true,
    playground: true,
    sortSchema: true,
})

export const apolloModuleUseTypes = GraphQLModule.forRoot<ApolloDriverConfig>({
    context: ({ res, reg }: GQLContext) => ({ reg, res }),
    driver: ApolloDriver,
    installSubscriptionHandlers: true,
    playground: true,
    sortSchema: true,
    typePaths: ['./**/*.graphql'],
})
