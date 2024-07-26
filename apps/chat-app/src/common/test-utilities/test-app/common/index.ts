import { INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { IMessageRepository } from '@root/common/repositories/message.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'

export const cleanDb = (module: TestingModule | INestApplication) => {
    const prisma = module.get<PrismaService>(PrismaService)
    return async () => {
        await prisma.message.deleteMany({})
        await prisma.usersConversation.deleteMany({})
        await prisma.userRenewToken.deleteMany({})
        await prisma.user.deleteMany({})
        await prisma.conversation.deleteMany({})
    }
}

export const getRepositories = (module: TestingModule | INestApplication) => ({
    conversation: module.get<IConversationRepository>(IConversationRepository),
    message: module.get<IMessageRepository>(IMessageRepository),
    user: module.get<IUserRepository>(IUserRepository),
})
