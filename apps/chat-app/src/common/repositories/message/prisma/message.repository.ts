import { Injectable } from '@nestjs/common'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { Message, MessageInput } from '@root/common/entities/message.entity'
import { PaginatedResponse } from '@root/common/types/paginated'
import { Conversation } from '@root/common/entities/conversation.entity'
import { IMessageRepository } from '../../message.repository'
import { toCoreMessage, toMessageCreate } from './mappers'

@Injectable()
export class MessagePrismaRepository implements IMessageRepository {
    constructor(private prisma: PrismaService) {}

    async createOne(message: MessageInput): Promise<Message> {
        const created = await this.prisma.message.create({
            data: toMessageCreate(message),
        })

        return toCoreMessage(created)
    }

    async findManyByConversationId(
        conversationId: Conversation['id'],
        pagination: { limit: number; cursor?: string },
    ): Promise<PaginatedResponse<Message>> {
        const found = await this.prisma.message.findMany({
            take: pagination.limit,
            where: {
                conversationId,
                id: {
                    gt: pagination.cursor,
                },
            },
        })

        const totalItems = await this.prisma.message.count({
            where: {
                conversationId,
                id: {
                    gt: pagination.cursor,
                },
            },
        })

        const cursor = found.at(-1)?.id ?? ''

        return { cursor, hasMore: totalItems > found.length, items: found.map(toCoreMessage) }
    }
}
