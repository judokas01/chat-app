import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { UserPrismaRepository } from '@root/auth/repository/prisma/user.repository'
import { IUserRepository } from '@root/auth/repository/user-repository.interface'
import { JWT } from '@root/auth/common/jwt.module'
import { DynamicModule, Provider, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '../config/config-service.service'

export const getTestModule = async (args: {
    imports?: DynamicModule[]
    providers?: Provider[]
}) => {
    const { imports, providers } = args
    const module: TestingModule = await Test.createTestingModule({
        imports: [JWT, ...(imports ?? [])],
        providers: [
            { provide: IUserRepository, useClass: UserPrismaRepository },
            PrismaService,
            ConfigService,
            ValidationPipe,
            ...(providers ?? []),
        ],
    }).compile()

    const prisma = module.get<PrismaService>(PrismaService)

    const cleanDb = async () => {
        await prisma.userRenewToken.deleteMany({})
        await prisma.user.deleteMany({})
    }

    const repositories = {
        user: module.get<IUserRepository>(IUserRepository),
    }

    return { cleanDb, module, repositories }
}

export type TestModule = Awaited<ReturnType<typeof getTestModule>>
