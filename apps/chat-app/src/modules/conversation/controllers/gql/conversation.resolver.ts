import { Args, Context, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@root/common/guards/authenticate/authenticate.guard'
import { GQLContext } from '@root/common/graphql/gql.context'
import { PubSub } from 'graphql-subscriptions'
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
    GetMessagesSubArgsGql,
    SendMessageArgsGql,
} from './request-type'

const MESSAGE_SUB_TOPIC = 'messageSent'
const pubSub = new PubSub()

@Resolver()
@UseGuards(AuthGuard)
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
        @Context() { user }: GQLContext,
    ): Promise<GqlConversation[]> {
        if (userId !== user.sub) {
            throw new UnauthorizedException('Cannot get conversations of another user')
        }
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
    async sendMessage(
        @Args() { conversationId, text }: SendMessageArgsGql,
        @Context() { user }: GQLContext,
    ): Promise<Message> {
        const created = await this.messageService.send({
            authorId: user.sub,
            conversationId,
            text,
        })

        await pubSub.publish(MESSAGE_SUB_TOPIC, { [MESSAGE_SUB_TOPIC]: toGqlMessage(created) })

        return toGqlMessage(created)
    }

    @Subscription(() => Message, {
        filter: (payload, variables: { conversationId: string }) =>
            payload[MESSAGE_SUB_TOPIC].conversationId === variables.conversationId,
        name: 'getConversationMessagesSub',
        resolve: (payload) => payload[MESSAGE_SUB_TOPIC],
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getConversationMessagesSub(
        @Args() { conversationId }: GetMessagesSubArgsGql,
        @Context() { user }: GQLContext,
    ) {
        const conversation = await this.getConversationService.getOneByIdAndUserId({
            conversationId,
            userId: user.sub,
        })

        if (!conversation) {
            throw new UnauthorizedException('Cannot get messages of another user')
        }

        return pubSub.asyncIterator(MESSAGE_SUB_TOPIC)
    }
}
