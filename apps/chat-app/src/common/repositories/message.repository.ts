import { Message, MessageInput } from '../entities/message.entity'
import { Conversation } from '../entities/conversation.entity'
import { PaginatedResponse } from '../types/paginated'

export interface IMessageRepository {
    createOne: (message: MessageInput) => Promise<Message>
    findManyByConversationId: (
        conversationId: Conversation['id'],
        pagination: { limit: number; cursor?: string },
    ) => Promise<PaginatedResponse<Message>>
}

export const IMessageRepository = Symbol('IMessageRepository')
