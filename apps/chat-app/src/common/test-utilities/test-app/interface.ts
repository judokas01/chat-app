import { DynamicModule, Logger, Module, Provider, Type, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import supertest from 'supertest'
import { apolloModuleUseTypes } from '@root/common/graphql/apollo'
import { UserPrismaRepository } from '@root/common/repositories/user/prisma/user.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { PrismaConversationRepository } from '@root/common/repositories/conversation/prisma/conversation.repository'
import { IMessageRepository } from '@root/common/repositories/message.repository'
import { MessagePrismaRepository } from '@root/common/repositories/message/prisma/message.repository'
import { AlwaysAuthenticatedAuthenticateService } from '@root/common/guards/authenticate/services/always-authenticated-authenticate.service'
import { IAuthGuard } from '@root/common/guards/authenticate/authenticate.guard'
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

    return {
        cleanDb: cleanDb(app),
        destroy: async () => await app.close(),
        module: app,
        repositories: getRepositories(app),
        request: supertest(apiUrl),
        requestGql: supertest(gqlUrl).post(''),
    }
}

export type TestInterfaceModule = Awaited<ReturnType<typeof getTestModuleWithInterface>>
