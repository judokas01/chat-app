import { Conversation } from '@root/common/entities/conversation.entity'
import { UsersConverstaion as PrismaConversation } from '@prisma/client'

export const toCoreConversation = (conversation: PrismaConversation): Conversation => {
    const { conversationId, customName, id } = conversation

    return { id, name: customName }
}
