import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { GQLContext } from '@root/common/graphql/gql.context'

export const apolloModule = GraphQLModule.forRoot<ApolloDriverConfig>({
    autoSchemaFile: true,
    context: ({ res, reg }: GQLContext) => ({ reg, res }),
    driver: ApolloDriver,
    installSubscriptionHandlers: true,
    playground: true,
    sortSchema: true,
})
