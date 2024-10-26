import { Conversation } from '@root/common/entities/conversation.entity'
import { User } from '@root/common/entities/user.entity'
import { GetMessagesResponse, MessageResponse } from '../../dto/message.dto'
import {
    ConversationMessageResponse,
    ConversationUser as GqlConversationUser,
    Conversation as GqlConversation,
    Message as GqlMessage,
} from './response'

export const toGqlConversation = (conversation: Conversation): GqlConversation => {
    const { id, data } = conversation

    return {
        createdAt: data.createdAt,
        id,
        lastMessageAt: data.lastMessageAt,
        name: data.name ?? null,
        // todo implement
        users: conversation.data.participants.get().map(toGqlUser),
    }
}

export const toGqlUser = (user: Readonly<User>): GqlConversationUser => ({
    email: user.data.email,
    id: user.id,
    userName: user.data.userName,
})

export const toConversationResponse = (
    conversation: GetMessagesResponse,
): ConversationMessageResponse => {
    const { cursor, hasMore, messages } = conversation

    return {
        cursor: cursor,
        hasMore: hasMore,
        messages: messages.map(toGqlMessage),
    }
}

export const toGqlMessage = ({
    author,
    createdAt,
    id,
    isRemoved,
    text,
    conversationId,
}: MessageResponse): GqlMessage => ({
    author: toGqlAuthor(author),
    conversationId,
    createdAt,
    id,
    isRemoved,
    text,
})

const toGqlAuthor = ({ email, id, userName }: GqlMessage['author']): GqlConversationUser => ({
    email,
    id,
    userName,
})
