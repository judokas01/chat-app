import { Message, MessageInput } from '../entities/message.entity'
import { Conversation } from '../entities/conversation.entity'

export interface IMessageRepository {
    createOne: (message: MessageInput) => Promise<Message>
    findManyByConversationId: (
        conversationId: Conversation['id'],
        pagination: { limit: number; cursor?: string },
    ) => Promise<Message[]>
}

export const IMessageRepository = Symbol('IMessageRepository')
