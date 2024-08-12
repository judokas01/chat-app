import { Conversation, ConversationInput } from '@root/common/entities/conversation.entity'
import {
    Prisma,
    UsersConversation as PrismaUserConversation,
    Message as PrismaMessage,
    Conversation as PrismaConversation,
} from '@prisma/client'

import { HasMany } from '@root/common/entities/common/Relationship'
// eslint-disable-next-line import/no-cycle
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
        messages: messages
            ? HasMany.loaded(messages.map(toCoreMessage), 'conversation.messages')
            : HasMany.unloaded('conversation.messages'),
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

export const toConversationCreate = (
    conversation: ConversationInput,
): Prisma.ConversationCreateInput => {
    const { name, lastMessageAt } = conversation
    const participants = conversation.participants.isLoaded()
        ? conversation.participants.get().map(({ id }) => ({ id }))
        : undefined

    const createManyData = participants ? participants.map(({ id }) => ({ userId: id })) : undefined

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
