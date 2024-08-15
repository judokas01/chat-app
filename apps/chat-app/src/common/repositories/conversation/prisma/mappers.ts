import { Conversation, ConversationInput } from '@root/common/entities/conversation.entity'
import {
    Prisma,
    Message as PrismaMessage,
    Conversation as PrismaConversation,
    UsersConversation as PrismaUsersConversation,
    User as PrismaUser,
} from '@prisma/client'

import { HasMany } from '@root/common/entities/common/Relationship'
// eslint-disable-next-line import/no-cycle
import { toCoreMessage } from '../../message/prisma/mappers'
import { toCoreUser } from '../../user/prisma/mappers'

export const toCoreConversation = (
    conversation: PrismaConversation & {
        messages?: PrismaMessage[]
        usersConversations?: ConversationPossibleWithUsers[]
    },
): Conversation => {
    const { id, createdAt, lastMessageAt, messages, usersConversations, customName } = conversation

    return new Conversation({
        createdAt,
        id,
        lastMessageAt,
        messages: messages
            ? HasMany.loaded(messages.map(toCoreMessage), 'conversation.messages')
            : HasMany.unloaded('conversation.messages'),
        name: customName,
        participants: toCoreParticipant(usersConversations),
    })
}

const toCoreParticipant = (
    userConversation?: ConversationPossibleWithUsers[],
): Conversation['data']['participants'] => {
    if (!userConversation) {
        return HasMany.loaded([], 'conversation.participants')
    }

    if (userConversation.every(hasUser)) {
        return HasMany.loaded(
            userConversation.map(({ user }) => toCoreUser(user)),
            'conversation.participants',
        )
    }

    return HasMany.unloaded('conversation.participants')
}

export const toConversationCreate = (
    conversation: ConversationInput,
): Prisma.ConversationCreateInput => {
    const { name, lastMessageAt } = conversation

    return {
        customName: name,
        lastMessageAt,
        usersConversations: conversation.participants.isLoaded()
            ? {
                  createMany: {
                      data: conversation.participants.get().map(({ id }) => ({ userId: id })),
                  },
              }
            : undefined,
    }
}

type ConversationPossibleWithUsers = ConversationWithoutUser | ConversationWithUser

type ConversationWithoutUser = PrismaUsersConversation & {
    user?: PrismaUser
}

type ConversationWithUser = PrismaUsersConversation & {
    user: PrismaUser
}

const hasUser = (
    conversation: ConversationPossibleWithUsers,
): conversation is ConversationWithUser => {
    return !!conversation.user
}
