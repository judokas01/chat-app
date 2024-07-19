import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Controller, Get, Module, UseGuards } from '@nestjs/common'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '../services/jwt-authenticate.service'

@Controller('api')
@UseGuards(AuthGuard)
export class GuardTestingApiRest {
    @Get('users')
    getUsers() {
        return 'users'
    }

    @Get('books')
    getBooks() {
        return 'books'
    }
}

@Resolver()
@UseGuards(AuthGuard)
export class GuardTestingApiGql {
    @Query(() => String)
    users(): string {
        return 'users'
    }

    @Query(() => String)
    books(): string {
        return 'books'
    }
}

@Module({
    controllers: [GuardTestingApiRest],
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            autoSchemaFile: true,
            driver: ApolloDriver,
        }),
    ],
    providers: [
        GuardTestingApiGql,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class GuardTestingModule {}
