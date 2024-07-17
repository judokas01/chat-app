import { INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'

export const cleanDb = (module: TestingModule | INestApplication) => {
    const prisma = module.get<PrismaService>(PrismaService)
    return async () => {
        await prisma.userRenewToken.deleteMany({})
        await prisma.user.deleteMany({})
    }
}

export const getRepositories = (module: TestingModule | INestApplication) => ({
    user: module.get<IUserRepository>(IUserRepository),
})
