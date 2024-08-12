import { Prisma, Message as PrismaMessage, User, Conversation } from '@prisma/client'
import { HasOne } from '@root/common/entities/common/Relationship'
import { Message, MessageInput } from '@root/common/entities/message.entity'
import { toCoreUser } from '../../user/prisma/mappers'
// eslint-disable-next-line import/no-cycle
import { toCoreConversation } from '../../conversation/prisma/mappers'

export const toMessageCreate = (input: MessageInput): Prisma.MessageCreateInput => ({
    author: {
        connect: {
            id: input.author.getId(),
        },
    },
    conversation: {
        connect: {
            id: input.conversation.getId(),
        },
    },
    createdAt: new Date(),
    isRemoved: false,
    text: input.text,
})

export const toCoreMessage = (
    message: PrismaMessage & {
        author?: User
        conversation?: Conversation
    },
): Message => {
    const { author, conversation, createdAt, id, isRemoved, text } = message
    return new Message({
        author: author
            ? HasOne.loaded(toCoreUser(author), 'message.author')
            : HasOne.unloaded('message.author', message.authorId),
        conversation: conversation
            ? HasOne.loaded(toCoreConversation(conversation), 'message.conversation')
            : HasOne.unloaded('message.conversation', message.conversationId),
        createdAt,
        id,
        isRemoved,
        text,
    })
}
