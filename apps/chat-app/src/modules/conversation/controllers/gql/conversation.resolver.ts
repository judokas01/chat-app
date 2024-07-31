import { Resolver } from '@nestjs/graphql'
import { CreateConversationService } from '../../create-conversation/create-conversation.service'
import { MessageService } from '../../message/send-message.service'

@Resolver()
export class ConversationResolver {
    constructor(
        private conversationService: CreateConversationService,
        private messageService: MessageService,
    ) {}
}
