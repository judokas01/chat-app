import { Inject, Injectable } from '@nestjs/common'
import { Conversation } from '@root/common/entities/conversation.entity'
import { User } from '@root/common/entities/user.entity'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'

@Injectable()
export class GetConversationService {
    constructor(
        @Inject(IUserRepository) private userRepository: IUserRepository,
        @Inject(IConversationRepository) private conversationRepository: IConversationRepository,
    ) {}

    getAllByUserId = async (userId: string) => {
        const user = await this.userRepository.findById(userId)

        if (!user) return []

        return await this.conversationRepository.findAllByUserId(user.id)
    }

    getOneByIdAndUserId = async (args: {
        userId: User['id']
        conversationId: Conversation['id']
    }) => {
        return await this.conversationRepository.findOne({
            id: args.conversationId,
            userId: args.userId,
        })
    }
}
