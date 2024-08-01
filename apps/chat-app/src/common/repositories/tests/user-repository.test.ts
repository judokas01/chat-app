import { describe, beforeEach, beforeAll, it, expect } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { User } from '@root/common/entities/user.entity'
import { faker } from '@faker-js/faker'

describe('User repository', () => {
    let testModule: TestModule

    beforeAll(async () => {
        testModule = await getTestModule({})
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should create user and retrieve it by id', async () => {
        const userToCreate = userMock.random.getOne()

        const created = await testModule.repositories.user.createOne(userToCreate)

        const found = await testModule.repositories.user.findById(created.id)

        validateUserStructure(found)
    })

    describe('find by sections', () => {
        let user1: User
        let user2: User

        beforeEach(async () => {
            ;[user1, user2] = await Promise.all([
                userMock.random.createOne({}, testModule),
                userMock.random.createOne({}, testModule),
            ])
        })

        it('should find one by id', async () => {
            const found = await testModule.repositories.user.findById(user1.id)

            validateUserStructure(found)
        })

        it('should find many by id', async () => {
            const found = await testModule.repositories.user.findManyByIds([user1.id, user2.id])
            expect(found).toHaveLength(2)

            found.forEach(validateUserStructure)
        })

        it.each([
            { getArgs: () => ({ email: user1.email }), text: 'by email' },
            { getArgs: () => ({ userName: user1.userName }), text: 'by username' },
            {
                getArgs: () => ({ email: user1.email, userName: user1.userName }),
                text: 'by email and username combinaion',
            },
        ])('should one by email', async ({ getArgs }) => {
            const found = await testModule.repositories.user.findOne(getArgs())
            validateUserStructure(found)
        })

        it.each([
            { getArgs: () => ({ email: user1.email.substring(3, 9) }), text: 'by email' },
            { getArgs: () => ({ userName: user1.userName.substring(3, 9) }), text: 'by username' },
            {
                getArgs: () => ({
                    email: user1.email.substring(3, 9),
                    userName: user1.userName.substring(3, 9),
                }),
                text: 'by email and username combinaion',
            },
        ])('should one by email', async ({ getArgs }) => {
            const found = await testModule.repositories.user.findManyByPartial(getArgs())
            expect(found).toHaveLength(1)

            found.forEach(validateUserStructure)
        })

        it('should update and find renew token by userId', async () => {
            const renewToken = faker.database.mongodbObjectId()
            await testModule.repositories.user.updateRenewToken(user1.id, renewToken)
            const found = await testModule.repositories.user.findRenewTokenByUserId(user1.id)
            expect(found).toBe(renewToken)
        })
    })
})

const validateUserStructure = (user: User | null) => {
    expect(user).not.toBeNull()
    expect(user).toMatchObject({
        conversations: expect.any(Object),
        createdAt: expect.any(Date),
        email: expect.any(String),
        id: expect.any(String),
        password: expect.any(String),
        userName: expect.any(String),
    } satisfies User)
}
