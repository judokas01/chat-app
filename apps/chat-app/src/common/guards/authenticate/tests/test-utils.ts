import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Controller, Get, Module, UseGuards } from '@nestjs/common'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '../authenticate.guard'

@Controller('api')
export class GuardTestingApiRest {
    @UseGuards(AuthGuard)
    @Get('guarded')
    getUsers() {
        return 'guarded'
    }

    @Get('free')
    getBooks() {
        return 'free'
    }
}

@Resolver()
export class GuardTestingApiGql {
    @Query(() => String)
    @UseGuards(AuthGuard)
    guarded(): string {
        return 'guarded'
    }

    @Query(() => String)
    free(): string {
        return 'free'
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
    providers: [GuardTestingApiGql],
})
export class GuardTestingModule {}
