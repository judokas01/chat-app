import { Conversation, ConversationInput } from '@root/common/entities/conversation.entity'
import {
    Prisma,
    UsersConversation as PrismaUserConversation,
    Message as PrismaMessage,
    Conversation as PrismaConversation,
} from '@prisma/client'

import { HasMany } from '@root/common/entities/common/Relationship'

export const toCoreConversation = (
    conversation: PrismaConversation & {
        messages?: PrismaMessage[]
        usersConversation?: PrismaUserConversation[]
    },
): Conversation => {
    const { id, createdAt, lastMessageAt, messages, usersConversation, customName } = conversation

    return {
        createdAt,
        id,
        lastMessageAt,
        messages: toCoreMessages(messages),
        name: customName,
        participants: toCoreParticipant(usersConversation),
    }
}

const toCoreParticipant = (
    userConversation?: PrismaUserConversation[],
): Conversation['participants'] => {
    if (!userConversation) {
        return new HasMany(undefined, 'conversation.participants')
    }

    return new HasMany(
        userConversation.map(({ userId }) => userId),
        'conversation.participants',
    )
}

const toCoreMessages = (messages?: PrismaMessage[]): Conversation['messages'] => {
    if (!messages) {
        return new HasMany(undefined, 'conversation.messages')
    }
    return new HasMany(
        messages.map(({ id }) => id),
        'conversation.participants',
    )
}

export const toConversationCreate = (
    conversation: ConversationInput,
): Prisma.ConversationCreateInput => {
    const { name } = conversation

    return {
        customName: name,
        lastMessageAt: null,
    }
}
