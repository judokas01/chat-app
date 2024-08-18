import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateConversationService } from '../../create-conversation/create-conversation.service'
import { MessageService } from '../../message/send-message.service'
import { GetConversationService } from '../../get-conversation/get-conversation.service'
import { FindUserService } from '../../find-user/find-user.service'
import { ConversationUser, Conversation as GqlConversation } from './response'
import { toGqlConversation, toGqlUser } from './mappers'
import { CreateConversationArgsGql, FindUsersArgsGql, GetConversationArgsGql } from './request-type'

@Resolver()
export class ConversationResolver {
    constructor(
        private conversationService: CreateConversationService,
        private messageService: MessageService,
        private getConversationService: GetConversationService,
        private findUserService: FindUserService,
    ) {}

    @Query(() => [GqlConversation], { name: 'getUserConversations' })
    async getUserConversations(
        @Args() { userId }: GetConversationArgsGql,
    ): Promise<GqlConversation[]> {
        const found = await this.getConversationService.getAllByUserId(userId)
        return found.map(toGqlConversation)
    }

    @Query(() => [ConversationUser], { name: 'findUsers' })
    async findUsers(@Args() { email, userName }: FindUsersArgsGql): Promise<ConversationUser[]> {
        const found = await this.findUserService.findMany({ email, userName })
        return found.map(toGqlUser)
    }

    @Mutation(() => GqlConversation, { name: 'createConversation' })
    async createConversation(
        @Args() { name, userIds }: CreateConversationArgsGql,
    ): Promise<GqlConversation> {
        const created = await this.conversationService.create(userIds, name)
        return toGqlConversation(created)
    }
}
