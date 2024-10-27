import { DynamicModule, Logger, Module, Provider, Type, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import supertest from 'supertest'
import WebSocket from 'ws'
import { apolloModuleUseTypes } from '@root/common/graphql/apollo'
import { UserPrismaRepository } from '@root/common/repositories/user/prisma/user.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { PrismaConversationRepository } from '@root/common/repositories/conversation/prisma/conversation.repository'
import { IMessageRepository } from '@root/common/repositories/message.repository'
import { MessagePrismaRepository } from '@root/common/repositories/message/prisma/message.repository'
import { AlwaysAuthenticatedAuthenticateService } from '@root/common/guards/authenticate/services/always-authenticated-authenticate.service'
import { IAuthGuard } from '@root/common/guards/authenticate/authenticate.guard'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { ExecutionResult, GraphQLError } from 'graphql'
import { ConfigService } from '../../config/config-service.service'
import { cleanDb, getRepositories } from './common'

export const getTestModuleWithInterface = async (args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module?: Type<any> | DynamicModule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    providers?: Provider[]
}) => {
    @Module({
        imports: [...(args?.module ? [args.module] : []), apolloModuleUseTypes],
        providers: [
            { provide: IUserRepository, useClass: UserPrismaRepository },
            { provide: IConversationRepository, useClass: PrismaConversationRepository },
            { provide: IMessageRepository, useClass: MessagePrismaRepository },
            PrismaService,
            ConfigService,
            ValidationPipe,
            { provide: IAuthGuard, useClass: AlwaysAuthenticatedAuthenticateService },
            ...(args.providers || []),
        ],
    })
    class TestAppMod {}

    const app = await NestFactory.create(TestAppMod, { logger: false })
    const globalPrefix = process.env.API_PREFIX || 'api'
    const port = process.env.PORT || 3000
    const apiUrl = `http://localhost:${port}/${globalPrefix}`
    const gqlUrl = `http://localhost:${port}/graphql`

    app.setGlobalPrefix(globalPrefix)
    await app.listen(port)
    Logger.log(`🚀 Application is running on: ${apiUrl}`)

    const GRAPHQL_ENDPOINT = `ws://localhost:${port}/graphql`
    const getNetworkInterface = (token?: string) =>
        new SubscriptionClient(
            GRAPHQL_ENDPOINT,
            { connectionParams: { Authorization: token }, reconnect: true },
            WebSocket,
        )

    const subScriptionResult: {
        data: ExecutionResult | null | undefined
        errors: readonly GraphQLError[] | undefined
    } = {
        data: undefined,
        errors: undefined,
    }

    return {
        cleanDb: () => {
            subScriptionResult.data = undefined
            subScriptionResult.errors = undefined
            return cleanDb(app)
        },
        destroy: async () => await app.close(),
        getSubscriptionResult: () => subScriptionResult,
        module: app,
        repositories: getRepositories(app),
        request: supertest(apiUrl),
        requestGql: supertest(gqlUrl).post(''),

        subscribeGql: (args: { query: string; variables?: Object; authToken?: string }) =>
            getNetworkInterface(args.authToken)
                .request({
                    query: args.query,
                    variables: args.variables,
                })
                .subscribe({
                    next({ data, errors }) {
                        subScriptionResult.data = data
                        subScriptionResult.errors = errors
                    },
                }),
    }
}

export type TestInterfaceModule = Awaited<ReturnType<typeof getTestModuleWithInterface>>
