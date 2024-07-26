import { describe, beforeEach, it, expect, beforeAll } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { conversationMock } from '@root/common/test-utilities/mocks/conversation'
import { Message } from '@root/common/entities/message.entity'
import { HasOne } from '@root/common/entities/common/Relationship'
import { faker } from '@faker-js/faker'
import { MessageResponse } from '../dto/message.dto'
import { MessageService } from './send-message.service'

describe('SendMessageService', () => {
    let testModule: TestModule
    let service: MessageService

    beforeAll(async () => {
        testModule = await getTestModule({ providers: [MessageService] })

        service = testModule.module.get<MessageService>(MessageService)
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should send one message and retrieve it', async () => {
        const { conversation, users } = await conversationMock.createOne(
            { userCount: 2 },
            testModule,
        )
        const [firstUser, secondUser] = users

        await service.send({
            authorId: firstUser.id,
            conversationId: conversation.id,
            text: 'Hi',
        })

        await service.send({
            authorId: secondUser.id,
            conversationId: conversation.id,
            text: 'Hello',
        })

        const found = await testModule.repositories.message.findManyByConversationId(
            conversation.id,
            {
                limit: 100,
            },
        )

        expect(found.items).toHaveLength(2)
        found.items.forEach((message) => {
            expect(message).toMatchObject({
                author: expect.any(HasOne),
                conversation: expect.any(HasOne),
                createdAt: expect.any(Date),
                id: expect.any(String),
                isRemoved: false,
                text: expect.any(String),
            } satisfies Message)
        })
    })

    it('should correctly scroll thought messages', async () => {
        const { conversation, users } = await conversationMock.createOne(
            { userCount: 2 },
            testModule,
        )
        const [firstUser, secondUser] = users

        const allMessages: MessageResponse[] = []
        for (let index = 0; index < 15; index++) {
            const send = await service.send({
                authorId: faker.datatype.boolean() ? firstUser.id : secondUser.id,
                conversationId: conversation.id,
                text: faker.lorem.sentence(),
            })

            allMessages.push(send)
        }

        const firstScroll = await testModule.repositories.message.findManyByConversationId(
            conversation.id,
            {
                limit: 4,
            },
        )

        const secondScroll = await testModule.repositories.message.findManyByConversationId(
            conversation.id,
            {
                cursor: firstScroll.cursor,
                limit: 4,
            },
        )
        const thirdScroll = await testModule.repositories.message.findManyByConversationId(
            conversation.id,
            {
                cursor: secondScroll.cursor,
                limit: 4,
            },
        )
        const finalScroll = await testModule.repositories.message.findManyByConversationId(
            conversation.id,
            {
                cursor: thirdScroll.cursor,
                limit: 4,
            },
        )

        ;[firstScroll, secondScroll, thirdScroll].forEach((scroll, index) => {
            expect(scroll.hasMore).toBeTruthy()
            expect(scroll.items).toHaveLength(4)
            expect(scroll.cursor).toBe(allMessages[index * 4 + 3].id)
        })

        expect(finalScroll.hasMore).toBeFalsy()
        expect(finalScroll.cursor).toBe(allMessages.at(-1)!.id)
    })
})
