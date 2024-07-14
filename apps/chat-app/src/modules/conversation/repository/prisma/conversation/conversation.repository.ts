import { Injectable } from '@nestjs/common'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { ConversationInput, Conversation } from '@root/common/entities/conversation.entity'
import { User } from '@root/common/entities/user.entity'
import { IConversationRepository } from '../../IConversationRepository'

@Injectable()
export class PrismaConversationRepository implements IConversationRepository {
    constructor(private prisma: PrismaService) {}

    createOne = async (conversation: ConversationInput): Promise<Conversation> => {}

    findById: (id: Conversation['id']) => Promise<Conversation | null>

    findAllByUserId: (userId: User['id']) => Promise<Conversation[]>
}
