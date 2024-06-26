import { Module, ValidationPipe } from '@nestjs/common'

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthResolver } from '@root/auth/controllers/gql/auth.resolver'
import { PrismaService } from './infrastructure/prisma/prisma.service'
import { AuthModule } from './auth/auth.module'
import { ConfigService } from './common/config/config-service.service'
import { GQLContext } from './common/gql.context'
import { JWT } from './auth/common/jwt.module'
import { LoginService } from './auth/login/login.service'
import { RegisterService } from './auth/register/register.service'
import { JwtAuthenticateService } from './auth/authenticate/services/jwt-authenticate.service'
import { UserPrismaRepository } from './auth/repository/prisma/user.repository'
import { IUserRepository } from './auth/repository/user-repository.interface'
import { IAuthenticateService } from './auth/authenticate/authenticate.interface'
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
    providers: [
        LoginService,
        RegisterService,
        JwtAuthenticateService,
        ConfigService,
        PrismaService,
        ValidationPipe,
        { provide: IUserRepository, useClass: UserPrismaRepository },
        { provide: IAuthenticateService, useClass: JwtAuthenticateService },
        AuthResolver,
    ],
})
export class AppModule {}
