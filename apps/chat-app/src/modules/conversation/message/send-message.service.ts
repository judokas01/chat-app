import { Inject, Injectable, ValidationPipe } from '@nestjs/common'
import { Conversation } from '@root/common/entities/conversation.entity'
import { Message, MessageInput } from '@root/common/entities/message.entity'
import { User } from '@root/common/entities/user.entity'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { IMessageRepository } from '@root/common/repositories/message.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { GetMessagesRequest, SendMessageRequest } from '../dto/message.dto'

@Injectable()
export class MessageService {
    constructor(
        @Inject(IUserRepository) private userRepository: IUserRepository,
        @Inject(IConversationRepository) private conversationRepository: IConversationRepository,
        @Inject(IMessageRepository) private messageRepository: IMessageRepository,
        private readonly validationPipe: ValidationPipe,
    ) {}

    send = async (args: SendMessageRequest) => {
        const { authorId, conversationId, text }: SendMessageRequest =
            await this.validationPipe.transform(args, {
                metatype: SendMessageRequest,
                type: 'body',
            })
    }

    getMessages = async (args: GetMessagesRequest) => {
        const { conversationId, pagination }: GetMessagesRequest =
            await this.validationPipe.transform(args, {
                metatype: GetMessagesRequest,
                type: 'body',
            })
    }
}
