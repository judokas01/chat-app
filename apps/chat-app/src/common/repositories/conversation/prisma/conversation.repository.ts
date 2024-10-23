import { Injectable } from '@nestjs/common'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { ConversationInput, Conversation } from '@root/common/entities/conversation.entity'
import { User } from '@root/common/entities/user.entity'
import { IConversationRepository } from '../../conversation.repository'
import { toConversationCreate, toConversationUpdate, toCoreConversation } from './mappers'

@Injectable()
export class PrismaConversationRepository implements IConversationRepository {
    constructor(private prisma: PrismaService) {}

    createOne = async (conversation: ConversationInput): Promise<Conversation> => {
        const created = await this.prisma.conversation.create({
            data: toConversationCreate(conversation),
            include: {
                messages: true,
                usersConversations: {
                    include: {
                        user: true,
                    },
                },
            },
        })

        return toCoreConversation(created)
    }

    findById = async (id: Conversation['id']): Promise<Conversation | null> => {
        const found = await this.prisma.conversation.findUnique({
            include: {
                messages: true,
                usersConversations: {
                    include: {
                        user: true,
                    },
                },
            },
            where: { id },
        })

        return found ? toCoreConversation(found) : null
    }

    findAllByUserId = async (userId: User['id']): Promise<Conversation[]> => {
        const found = await this.prisma.conversation.findMany({
            include: {
                usersConversations: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                lastMessageAt: 'desc',
            },
            where: { usersConversations: { some: { userId } } },
        })

        return found.map(toCoreConversation)
    }

    updateOne = async (conversation: Conversation): Promise<Conversation> => {
        const updated = await this.prisma.conversation.update({
            data: toConversationUpdate(conversation),
            where: { id: conversation.id },
        })

        return toCoreConversation(updated)
    }

    findOne = async (args: {
        id: Conversation['id']
        userId: User['id']
    }): Promise<Conversation | null> => {
        const found = await this.prisma.conversation.findFirst({
            where: {
                id: args.id,
                usersConversations: {
                    some: {
                        userId: args.userId,
                    },
                },
            },
        })

        return found ? toCoreConversation(found) : null
    }
}
