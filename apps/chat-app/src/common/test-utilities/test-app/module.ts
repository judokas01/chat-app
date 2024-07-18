import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { JWT } from '@root/modules/auth/common/jwt.module'
import { DynamicModule, Provider, ValidationPipe, Type } from '@nestjs/common'
import { UserPrismaRepository } from '@root/common/repositories/user/prisma/user.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { PrismaConversationRepository } from '@root/common/repositories/conversation/prisma/conversation/conversation.repository'
import { ConfigService } from '../../config/config-service.service'
import { cleanDb, getRepositories } from './common'

export const getTestModule = async (args: {
    imports?: DynamicModule[]
    providers?: Provider[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controllers?: Type<any>[]
}) => {
    const { imports, providers, controllers } = args
    const module: TestingModule = await Test.createTestingModule({
        controllers: [...(controllers ?? [])],
        imports: [JWT, ...(imports ?? [])],
        providers: [
            { provide: IUserRepository, useClass: UserPrismaRepository },
            { provide: IConversationRepository, useClass: PrismaConversationRepository },
            PrismaService,
            ConfigService,
            ValidationPipe,
            ...(providers ?? []),
        ],
    }).compile()

    return { cleanDb: cleanDb(module), module, repositories: getRepositories(module) }
}

export type TestModule = Awaited<ReturnType<typeof getTestModule>>
