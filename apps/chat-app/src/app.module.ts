import { Module } from '@nestjs/common'

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthResolver } from '@root/auth/controllers/gql/auth.resolver'
import { PrismaService } from './infrastructure/prisma/prisma.service'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { ConfigService } from './common/config/config-service.service'

@Module({
    controllers: [AppController],
    imports: [
        AuthModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            autoSchemaFile: 'schema.gql',
            context: ({ req, res }) => ({ req, res }),
            driver: ApolloDriver,
            installSubscriptionHandlers: true,
            playground: true,

            sortSchema: true,
        }),
    ],
    providers: [AppService, PrismaService, ConfigService, AuthResolver],
})
export class AppModule {}
