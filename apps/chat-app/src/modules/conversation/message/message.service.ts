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
        const participantIds = conversation?.data.participants.get().map((user) => user.id)

        if (!participantIds?.includes(authorId)) {
            throw new InvalidConversationUserError()
        }

        if (!conversation) {
            throw new ConversationNotFoundError()
        }

        const newMessage = await this.messageRepository.createOne({
            author: HasOne.unloaded('message.author', authorId),
            conversation: HasOne.unloaded('message.conversation', conversationId),
            text,
        })

        const userMap = await this.getAuthorsFromMessages([newMessage])

        return {
            author: this.getAuthor(authorId, userMap),
            createdAt: newMessage.data.createdAt,
            id: newMessage.id,
            isRemoved: newMessage.data.isRemoved,
            text: newMessage.data.text,
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
            messages: items.map(({ data }) => {
                const { author, id, createdAt, text, isRemoved } = data
                return {
                    author: this.getAuthor(author.getId(), userMap),
                    createdAt,
                    id,
                    isRemoved,
                    text,
                }
            }),
        }
    }

    private getAuthorsFromMessages = async (
        messages: Message[],
    ): Promise<Map<User['id'], User>> => {
        const usersFromMessages = uniq(messages.map(({ data }) => data.author.getId()))
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

        const { email, id, userName } = user.data

        return { email: email, id: id, userName: userName }
    }
}
