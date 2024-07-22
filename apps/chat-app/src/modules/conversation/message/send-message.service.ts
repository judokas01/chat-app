import { Inject, Injectable } from '@nestjs/common'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { IMessageRepository } from '@root/common/repositories/message.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'

@Injectable()
export class MessageService {
    constructor(
        @Inject(IUserRepository) private userRepository: IUserRepository,
        @Inject(IConversationRepository) private conversationRepository: IConversationRepository,
        @Inject(IMessageRepository) private messageRepository: IMessageRepository,
    ) {}

    send = async () => {}

    getMessages = async () => {}
}
