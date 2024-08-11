import { Conversation, ConversationInput } from '@root/common/entities/conversation.entity'
import {
    Prisma,
    UsersConversation as PrismaUserConversation,
    Message as PrismaMessage,
    Conversation as PrismaConversation,
} from '@prisma/client'

import { HasMany } from '@root/common/entities/common/Relationship'
import { toCoreMessage } from '../../message/prisma/mappers'
import { toCoreUser } from '../../user/prisma/mappers'

export const toCoreConversation = (
    conversation: PrismaConversation & {
        messages?: PrismaMessage[]
        usersConversation?: PrismaUserConversation[]
    },
): Conversation => {
    const { id, createdAt, lastMessageAt, messages, usersConversation, customName } = conversation

    return new Conversation({
        createdAt,
        id,
        lastMessageAt,
        messages: toCoreMessages(messages),
        name: customName,
        participants: toCoreParticipant(usersConversation),
    })
}

const toCoreParticipant = (
    userConversation?: PrismaUserConversation[],
): Conversation['data']['participants'] => {
    if (!userConversation) {
        return HasMany.loaded([], 'conversation.participants')
    }

    return HasMany.loaded(userConversation.map(toCoreUser), 'conversation.participants')
}

const toCoreMessages = (messages?: PrismaMessage[]): Conversation['messages'] => {
    if (!messages) {
        return HasMany.unloaded('conversation.messages')
    }
    return HasMany.loaded(messages.map(toCoreMessage), 'conversation.participants')
}

export const toConversationCreate = (
    conversation: ConversationInput,
): Prisma.ConversationCreateInput => {
    const { name, lastMessageAt } = conversation
    const participants = conversation.participants.toRefArray()

    const createManyData =
        'id' in participants ? undefined : participants.map(({ id }) => ({ userId: id }))

    return {
        customName: name,
        lastMessageAt,
        usersConversation: createManyData
            ? {
                  createMany: {
                      data: createManyData,
                  },
              }
            : undefined,
    }
}
