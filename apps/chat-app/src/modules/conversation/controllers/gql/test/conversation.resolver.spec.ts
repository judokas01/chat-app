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
import { ConversationModule } from '../../../conversation.module'
import { ConversationUser, Conversation as GqlConversation } from '../response'
import { FindUsersArgsGql } from '../request-type'
import { findUsersGqlRequest, getUserConversationGqlRequest } from './helpers'

describe('ConversationResolver - smoke test', () => {
    let testModule: TestInterfaceModule

    beforeEach(async () => {
        testModule = await getTestModuleWithInterface({
            module: ConversationModule,
            providers: [{ provide: IAuthGuard, useClass: AlwaysAuthenticatedAuthenticateService }],
        })

        await testModule.cleanDb()
    })

    afterEach(async () => {
        await testModule.destroy()
    })

    it('should return all users conversations', async () => {
        const numberOfConversations = faker.number.int({ max: 5, min: 1 })
        const user = await userMock.random.createOne({}, testModule)

        await Promise.all(
            Array.from({ length: numberOfConversations }).map(() =>
                conversationMock.createOne({ user }, testModule),
            ),
        )

        const conversations = await testModule.requestGql.send(
            getUserConversationGqlRequest({ userId: user.id }),
        )

        const items = conversations.body.data.getUserConversations as GqlConversation[]
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

        const conversations = await testModule.requestGql.send(findUsersGqlRequest(getArgs(user)))

        const items = conversations.body.data.findUsers as ConversationUser[]
        expect(items).toHaveLength(1)

        items.forEach((conversation) => {
            expect(conversation).toMatchObject({
                email: user.data.email,
                id: user.id,
                userName: user.data.userName,
            } satisfies ConversationUser)
        })
    })
})
