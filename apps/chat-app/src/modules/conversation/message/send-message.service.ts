import { Inject, Injectable, ValidationPipe } from '@nestjs/common'
import { Message } from '@root/common/entities/message.entity'
import { User } from '@root/common/entities/user.entity'
import { IConversationRepository } from '@root/common/repositories/conversation.repository'
import { IMessageRepository } from '@root/common/repositories/message.repository'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { uniq } from 'ramda'
import { HasOne } from '@root/common/entities/common/Relationship'
import {
    GetMessagesRequest,
    GetMessagesResponse,
    MessageResponse,
    SendMessageRequest,
} from '../dto/message.dto'
import { ConversationNotFoundError, InvalidConversationUserError } from './exceptions'

@Injectable()
export class MessageService {
    constructor(
        @Inject(IUserRepository) private userRepository: IUserRepository,
        @Inject(IConversationRepository) private conversationRepository: IConversationRepository,
        @Inject(IMessageRepository) private messageRepository: IMessageRepository,
        private readonly validationPipe: ValidationPipe,
    ) {}

    send = async (args: SendMessageRequest): Promise<MessageResponse> => {
        const { authorId, conversationId, text }: SendMessageRequest =
            await this.validationPipe.transform(args, {
                metatype: SendMessageRequest,
                type: 'body',
            })

        const conversation = await this.conversationRepository.findById(conversationId)
        const participantIds = conversation?.participants.getRefsOrFail()

        if (!participantIds?.includes(authorId)) {
            throw new InvalidConversationUserError()
        }

        if (!conversation) {
            throw new ConversationNotFoundError()
        }

        const newMessage = await this.messageRepository.createOne({
            author: new HasOne(authorId, 'message.author'),
            conversation: new HasOne(conversationId, 'message.conversation'),
            text,
        })

        const userMap = await this.getAuthorsFromMessages([newMessage])

        return {
            author: this.getAuthor(authorId, userMap),
            createdAt: newMessage.createdAt,
            id: newMessage.id,
            isRemoved: newMessage.isRemoved,
            text: newMessage.text,
        }
    }

    getMessages = async (args: GetMessagesRequest): Promise<GetMessagesResponse> => {
        const { conversationId, pagination }: GetMessagesRequest =
            await this.validationPipe.transform(args, {
                metatype: GetMessagesRequest,
                type: 'body',
            })

        const { cursor, hasMore, items } = await this.messageRepository.findManyByConversationId(
            conversationId,
            pagination,
        )

        const userMap = await this.getAuthorsFromMessages(items)

        return {
            cursor,
            hasMore,
            messages: items.map(({ author, id, createdAt, text, isRemoved }) => ({
                author: this.getAuthor(author.getRefOrFail(), userMap),
                createdAt,
                id,
                isRemoved,
                text,
            })),
        }
    }

    private getAuthorsFromMessages = async (
        messages: Message[],
    ): Promise<Map<User['id'], User>> => {
        const usersFromMessages = uniq(messages.map(({ author }) => author.getRefOrFail()))
        const users = await this.userRepository.findManyByIds(usersFromMessages)

        const userMap = new Map(users.map((user) => [user.id, user]))

        return userMap
    }

    private getAuthor = (
        userId: User['id'],
        userMap: Map<User['id'], User>,
    ): MessageResponse['author'] => {
        const user = userMap.get(userId)

        if (!user) {
            throw new Error(`User with id ${userId} not found`)
        }

        return { email: user.email, id: user.id, userName: user.userName }
    }
}
