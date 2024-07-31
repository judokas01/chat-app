import { Inject, Injectable } from '@nestjs/common'
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

        const found = await this.conversationRepository.findAllByUserId(user.id)
    }
}
