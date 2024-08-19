import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateConversationService } from '../../create-conversation/create-conversation.service'
import { MessageService } from '../../message/message.service'
import { GetConversationService } from '../../get-conversation/get-conversation.service'
import { FindUserService } from '../../find-user/find-user.service'
import {
    ConversationMessageResponse,
    ConversationUser,
    Conversation as GqlConversation,
    Message,
} from './response'
import { toConversationResponse, toGqlConversation, toGqlMessage, toGqlUser } from './mappers'
import {
    CreateConversationArgsGql,
    FindUsersArgsGql,
    GetConversationArgsGql,
    GetConversationMessagesArgsGql,
    SendMessageArgsGql,
} from './request-type'

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

    @Query(() => ConversationMessageResponse, { name: 'getConversationMessages' })
    async getConversationMessages(
        @Args() { pagination, conversationId }: GetConversationMessagesArgsGql,
    ): Promise<ConversationMessageResponse> {
        const found = await this.messageService.getMessages({ conversationId, pagination })
        return toConversationResponse(found)
    }

    @Mutation(() => GqlConversation, { name: 'createConversation' })
    async createConversation(
        @Args() { name, userIds }: CreateConversationArgsGql,
    ): Promise<GqlConversation> {
        const created = await this.conversationService.create(userIds, name)
        return toGqlConversation(created)
    }

    @Mutation(() => Message, { name: 'sendMessage' })
    async sendMessage(@Args() { conversationId, text }: SendMessageArgsGql): Promise<Message> {
        // implement auth and get user from context
        const created = await this.messageService.send({ conversationId, text })
        return toGqlMessage(created)
    }
}
