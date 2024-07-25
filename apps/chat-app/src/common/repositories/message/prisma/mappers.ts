import { Prisma, Message as PrismaMessage } from '@prisma/client'
import { HasOne } from '@root/common/entities/common/Relationship'
import { Message, MessageInput } from '@root/common/entities/message.entity'

export const toMessageCreate = (input: MessageInput): Prisma.MessageCreateInput => ({
    author: {
        connect: {
            id: input.author.getRefOrFail(),
        },
    },
    conversation: {
        connect: {
            id: input.conversation.getRefOrFail(),
        },
    },
    createdAt: new Date(),
    isRemoved: false,
    text: input.text,
})

export const toCoreMessage = (message: PrismaMessage): Message => ({
    author: new HasOne(message.authorId, 'message.author'),
    conversation: new HasOne(message.conversationId, 'message.conversation'),
    createdAt: message.createdAt,
    id: message.id,
    isRemoved: message.isRemoved,
    text: message.text,
})
