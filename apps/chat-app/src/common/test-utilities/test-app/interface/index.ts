import { Logger, Module, Type } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { UserPrismaRepository } from '@root/auth/repository/prisma/user.repository'
import { IUserRepository } from '@root/auth/repository/user-repository.interface'
import supertest from 'supertest'
import { apolloModule } from '@root/common/graphql/apollo'
import { ConfigService } from '../../../config/config-service.service'
import { cleanDb, getRepositories } from '../common'
import 'reflect-metadata'

export const getTestModuleWithInterface = async (args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: Type<any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    providers?: Type<any>[]
}) => {
    @Module({
        imports: [args.module, apolloModule],
        providers: [
            { provide: IUserRepository, useClass: UserPrismaRepository },
            PrismaService,
            ConfigService,
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
        destroy: async () => {
            await app.close()
        },
        module: app,
        repositories: getRepositories(app),
        request: supertest(apiUrl),
        requestGql: supertest(gqlUrl),
    }
}

export type TestInterfaceModule = Awaited<ReturnType<typeof getTestModuleWithInterface>>
