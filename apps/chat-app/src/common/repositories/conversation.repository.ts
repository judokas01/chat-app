import { Conversation, ConversationInput } from '@root/common/entities/conversation.entity'
import { User } from '@root/common/entities/user.entity'

export interface IConversationRepository {
    createOne: (conversation: ConversationInput) => Promise<Conversation>
    updateOne: (conversation: Conversation) => Promise<Conversation>
    findById: (id: Conversation['id']) => Promise<Conversation | null>
    findOne: (args: { id: Conversation['id']; userId: User['id'] }) => Promise<Conversation | null>
    findAllByUserId: (userId: User['id']) => Promise<Conversation[]>
}
export const IConversationRepository = Symbol('IConversationRepository')
