import { TestingModule } from '@nestjs/testing'
import { IUserRepository } from '@root/auth/repository/user-repository.interface'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'

export const cleanDb = (module: TestingModule) => {
    const prisma = module.get<PrismaService>(PrismaService)
    return async () => {
        await prisma.userRenewToken.deleteMany({})
        await prisma.user.deleteMany({})
    }
}

export const getRepositories = (module: TestingModule) => ({
    user: module.get<IUserRepository>(IUserRepository),
})
