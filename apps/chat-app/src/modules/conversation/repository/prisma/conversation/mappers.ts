import { Conversation, ConversationInput } from '@root/common/entities/conversation.entity'
import {
    Prisma,
    UsersConversation as PrismaUserConversation,
    Message as PrismaMessage,
    Conversation as PrismaConversation,
} from '@prisma/client'

export const toCoreConversation = (
    conversation: PrismaConversation & {
        messages?: PrismaMessage[]
        usersConversation?: PrismaUserConversation[]
    },
): Conversation => {
    const { conversationId, customName, id } = conversation

    return { id, name: customName }
}

export const toConversationCreate = (
    conversation: ConversationInput,
): Prisma.ConversationCreateInput => {
    const { messages, name, participants } = conversation

    return {
        lastMessageAt: null,
        title: name,
    }
}
