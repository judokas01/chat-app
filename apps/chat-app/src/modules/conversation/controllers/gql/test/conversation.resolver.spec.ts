import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
    getTestModuleWithInterface,
    TestInterfaceModule,
} from '@root/common/test-utilities/test-app/interface'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { conversationMock } from '@root/common/test-utilities/mocks/conversation'
import { faker } from '@faker-js/faker'
import { User } from '@root/common/entities/user.entity'
import { AlwaysAuthenticatedAuthenticateService } from '@root/common/guards/authenticate/services/always-authenticated-authenticate.service'
import { IAuthGuard } from '@root/common/guards/authenticate/authenticate.guard'
import { ConversationModule } from '@root/modules/conversation/conversation.module'
import { getTestModule } from '@root/common/test-utilities/test-app/no-interface'
import { responseContainsNoErrors } from '@root/common/graphql/test-utils'
import { ConversationData } from '@root/common/entities/conversation.entity'
import { HasMany } from '@root/common/entities/common/Relationship'
import { FindUsersArgsGql } from '../request-type'
import { ConversationUser, Conversation as GqlConversation, Message } from '../response'
import {
    createConversationMutationGqlRequest,
    findUsersGqlRequest,
    getConversationMessagesSub,
    getUserConversationGqlRequest,
    sendMessageMutationGqlRequest,
} from './helpers'

describe('ConversationResolver - smoke test', () => {
    let testModule: TestInterfaceModule
    let authenticatedUser: User

    beforeEach(async () => {
        const tempModule = await getTestModule({})
        await tempModule.cleanDb()
        authenticatedUser = await userMock.random.createOne({}, tempModule)

        testModule = await getTestModuleWithInterface({
            module: ConversationModule.register([
                {
                    provide: IAuthGuard,
                    useFactory: () =>
                        AlwaysAuthenticatedAuthenticateService.createWithPayload({
                            sub: authenticatedUser.id,
                            userName: authenticatedUser.data.userName,
                        }),
                },
            ]),
        })
    })

    afterEach(async () => {
        await testModule.destroy()
    })

    it('should return all users conversations', async () => {
        const numberOfConversations = faker.number.int({ max: 5, min: 1 })
        const user = authenticatedUser

        await Promise.all(
            Array.from({ length: numberOfConversations }).map(() =>
                conversationMock.createOne({ user }, testModule),
            ),
        )

        const { body } = await testModule.requestGql.send(
            getUserConversationGqlRequest({ userId: user.id }),
        )

        responseContainsNoErrors(body)

        const items = body.data.getUserConversations as GqlConversation[]
        expect(items).toHaveLength(numberOfConversations)

        items.forEach((conversation) => {
            expect(conversation).toMatchObject({
                createdAt: expect.any(String),
                id: expect.any(String),
                lastMessageAt: null,
                name: null,
                users: expect.any(Array),
            } satisfies GqlConversation)
        })
    })

    it.each([
        {
            getArgs: (user: User): FindUsersArgsGql => ({ email: user.data.email }),
            text: 'by email',
        },
        {
            getArgs: (user: User): FindUsersArgsGql => ({ userName: user.data.userName }),
            text: 'by userName',
        },
        {
            getArgs: (user: User): FindUsersArgsGql => ({
                email: user.data.email,
                userName: user.data.userName,
            }),
            text: 'by both',
        },
    ])('should return all users found by $text', async ({ getArgs }) => {
        const user = await userMock.random.createOne({}, testModule)

        const { body } = await testModule.requestGql.send(findUsersGqlRequest(getArgs(user)))

        responseContainsNoErrors(body)
        const items = body.data.findUsers as ConversationUser[]
        expect(items).toHaveLength(1)

        items.forEach((conversation) => {
            expect(conversation).toMatchObject({
                email: user.data.email,
                id: user.id,
                userName: user.data.userName,
            } satisfies ConversationUser)
        })
    })

    it('should create conversation and retrieve it', async () => {
        const secondUser = await userMock.random.createOne({}, testModule)

        const { body } = await testModule.requestGql.send(
            createConversationMutationGqlRequest({
                name: faker.internet.userName(),
                userIds: [secondUser.id, authenticatedUser.id],
            }),
        )

        responseContainsNoErrors(body)

        const conversation = await testModule.repositories.conversation.findById(
            body.data.createConversation.id,
        )

        expect(conversation).not.toBeNull()
        expect(conversation?.data).toMatchObject({
            createdAt: expect.any(Date),
            id: expect.any(String),
            lastMessageAt: null,
            messages: expect.any(HasMany),
            name: expect.any(String),
            participants: expect.any(HasMany),
        } satisfies ConversationData)

        const participants = conversation?.data.participants.get()

        expect(participants).toHaveLength(2)
        expect(participants!.map((e) => e.id).sort()).toEqual(
            [secondUser.id, authenticatedUser.id].sort(),
        )
    })

    it('should send a message to conversation and retrieve it', async () => {
        const messageText = faker.lorem.sentence()
        const { conversation } = await conversationMock.createOne(
            {
                conversation: {
                    lastMessageAt: null,
                    name: faker.internet.userName(),
                },
                user: authenticatedUser,
            },
            testModule,
        )

        const { body } = await testModule.requestGql.send(
            sendMessageMutationGqlRequest({
                conversationId: conversation.id,
                text: messageText,
            }),
        )

        responseContainsNoErrors(body)
        expect(body.data.sendMessage).toMatchObject({
            author: {
                email: authenticatedUser.data.email,
                id: authenticatedUser.id,
                userName: authenticatedUser.data.userName,
            },
            createdAt: expect.any(String),
            id: expect.any(String),
            isRemoved: false,
            text: expect.any(String),
        } satisfies Message)

        const updatedConversation = await testModule.repositories.conversation.findById(
            conversation.id,
        )

        const messages = updatedConversation?.data.messages.get()
        expect(messages).toHaveLength(1)
        const message = messages!.at(0)
        expect(message?.data.text).toEqual(messageText)

        expect(updatedConversation?.data).toMatchObject({
            createdAt: expect.any(Date),
            id: expect.any(String),
            lastMessageAt: expect.any(Date),
            messages: expect.any(HasMany),
            name: expect.any(String),
            participants: expect.any(HasMany),
        } satisfies ConversationData)
    })

    it('should get unathorized error, when subscriptions attempts to access conversation not participated by a user', async () => {
        const anotherUser = await userMock.random.createOne({}, testModule)
        const { conversation } = await conversationMock.createOne(
            {
                conversation: {
                    lastMessageAt: null,
                    name: faker.internet.userName(),
                },
                user: anotherUser,
            },
            testModule,
        )

        console.log(conversation)

        const { body } = await testModule.requestGql.send(
            getConversationMessagesSub({
                conversationId: conversation.id,
            }),
        )

        console.log(JSON.stringify(body.errors))

        responseContainsNoErrors(body)
    })
})
