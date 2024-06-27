import { Module } from '@nestjs/common'

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthModule } from './auth/auth.module'
import { GQLContext } from './common/gql.context'
import { JWT } from './auth/common/jwt.module'
import { RestController } from './auth/controllers/rest/rest.controller'

@Module({
    controllers: [RestController],
    imports: [
        AuthModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            autoSchemaFile: 'schema.gql',
            context: ({ res, reg }: GQLContext) => ({ reg, res }),
            driver: ApolloDriver,
            installSubscriptionHandlers: true,
            playground: true,

            sortSchema: true,
        }),
        JWT,
    ],
})
export class AppModule {}
