import { Controller } from '@nestjs/common'
import { CreateConversationService } from '../../create-conversation/create-conversation.service'
import { MessageService } from '../../message/send-message.service'

@Controller('conversation')
export class ConversationController {
    constructor(
        private conversationService: CreateConversationService,
        private messageService: MessageService,
    ) {}
}
