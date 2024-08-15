import { Args, Query, Resolver } from '@nestjs/graphql'
import { CreateConversationService } from '../../create-conversation/create-conversation.service'
import { MessageService } from '../../message/send-message.service'
import { GetConversationService } from '../../get-conversation/get-conversation.service'
import { Conversation as GqlConversation } from './response'
import { toGqlConversation } from './mappers'
import { GetConversationArgsGql } from './request-type'

@Resolver()
export class ConversationResolver {
    constructor(
        private conversationService: CreateConversationService,
        private messageService: MessageService,
        private getConversationService: GetConversationService,
    ) {}

    @Query(() => [GqlConversation], { name: 'getUserConversations' })
    async getUserConversations(
        @Args() { userId }: GetConversationArgsGql,
    ): Promise<GqlConversation[]> {
        const found = await this.getConversationService.getAllByUserId(userId)
        return found.map(toGqlConversation)
    }
}
