import { Injectable } from '@nestjs/common'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { ConversationInput, Conversation } from '@root/common/entities/conversation.entity'
import { User } from '@root/common/entities/user.entity'
import { IConversationRepository } from '../../conversation.repository'
import { toConversationCreate, toCoreConversation } from './mappers'

@Injectable()
export class PrismaConversationRepository implements IConversationRepository {
    constructor(private prisma: PrismaService) {}

    createOne = async (conversation: ConversationInput): Promise<Conversation> => {
        const created = await this.prisma.conversation.create({
            data: toConversationCreate(conversation),
            include: { messages: true, usersConversation: true },
        })

        return toCoreConversation(created)
    }

    findById = async (id: Conversation['id']): Promise<Conversation | null> => {
        const found = await this.prisma.conversation.findUnique({
            include: { messages: true, usersConversation: true },
            where: { id },
        })

        return found ? toCoreConversation(found) : null
    }

    findAllByUserId = async (userId: User['id']): Promise<Conversation[]> => {
        const found = await this.prisma.conversation.findMany({
            include: { messages: true, usersConversation: true },
            orderBy: {
                lastMessageAt: 'desc',
            },
            where: { usersConversation: { some: { userId } } },
        })

        return found.map(toCoreConversation)
    }
}
