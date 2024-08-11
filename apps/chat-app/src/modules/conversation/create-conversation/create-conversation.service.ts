import { Inject, Injectable } from '@nestjs/common'
import { User } from '@root/common/entities/user.entity'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { HasMany } from '@root/common/entities/common/Relationship'
import { UserNotFound } from './exceptions'

@Injectable()
export class CreateConversationService {
    constructor(
        @Inject(IUserRepository) private userRepository: IUserRepository,
        @Inject(IConversationRepository) private conversationRepository: IConversationRepository,
    ) {}

    create = async (userIds: User['id'][], name?: string) => {
        const found = await Promise.all(
            userIds.map(async (id) => {
                const user = await this.userRepository.findById(id)

                if (!user) throw new UserNotFound(id)

                return user
            }),
        )

        const created = await this.conversationRepository.createOne({
            lastMessageAt: null,
            messages: HasMany.unloaded('conversation.messages'),
            name: name ?? null,
            participants: HasMany.loaded(found, 'conversation.participants'),
        })

        return created
    }
}
