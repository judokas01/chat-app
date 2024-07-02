import { Logger, Type } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { UserPrismaRepository } from '@root/auth/repository/prisma/user.repository'
import { IUserRepository } from '@root/auth/repository/user-repository.interface'
import supertest from 'supertest'
import { ConfigService } from '../../config/config-service.service'
import { cleanDb, getRepositories } from './common'

export const getTestModuleWithInterface = async (args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: Type<any>
}) => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            { provide: IUserRepository, useClass: UserPrismaRepository },
            PrismaService,
            ConfigService,
        ],
    }).compile()

    const app = await NestFactory.create(args.module)
    const globalPrefix = process.env.API_PREFIX || 'api'
    const port = process.env.PORT || 3000

    app.setGlobalPrefix(globalPrefix)
    await app.listen(port)
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)

    return {
        cleanDb: cleanDb(module),
        destroy: async () => {
            await app.close()
        },
        module,
        repositories: getRepositories(module),
        request: supertest(`http://localhost:${port}/${globalPrefix}`),
    }
}

export type TestInterfaceModule = Awaited<ReturnType<typeof getTestModuleWithInterface>>
