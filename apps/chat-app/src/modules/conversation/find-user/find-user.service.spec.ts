import { describe, it, expect, beforeAll } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { faker } from '@faker-js/faker'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { User } from '@root/common/entities/user.entity'
import { FindUserRequest } from '../dto/find-user.dto'
import { FindUserService } from './find-user.service'

describe('FindUserService', () => {
    let testModule: TestModule
    let service: FindUserService

    beforeAll(async () => {
        testModule = await getTestModule({ providers: [FindUserService] })
        service = testModule.module.get<FindUserService>(FindUserService)
        await testModule.cleanDb()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('validation pipe tests', () => {
        it('should throw when no argument is passed', async () => {
            await expect(service.findUser({})).rejects.toThrow('Bad Request')
        })

        it('should throw when no valid argument is passed', async () => {
            const invalidArgs = { unknownProperty: 'unknown' } as unknown as FindUserRequest
            await expect(service.findUser(invalidArgs)).rejects.toThrow('Bad Request')
        })

        it.each([
            { email: faker.internet.email(), userName: faker.internet.userName() },
            { email: faker.internet.email() },
            { userName: faker.internet.userName() },
        ] satisfies FindUserRequest[])(
            'should not trow when at least one is input',
            async (args) => {
                await expect(service.findUser(args)).resolves.not.toThrow('Bad Request')
            },
        )
    })

    describe('find one', () => {
        let user: User
        beforeAll(async () => {
            await testModule.cleanDb()
            user = await userMock.random.createOne({}, testModule)
        })

        it.each([
            { getArgs: ({ userName }: User) => ({ userName }), text: 'username' },
            { getArgs: ({ email }: User) => ({ email }), text: 'email' },
            {
                getArgs: ({ userName, email }: User) => ({ email, userName }),
                text: 'username and email',
            },
        ] satisfies { getArgs: (user: User) => FindUserRequest; text: string }[])(
            'should find user by $text',
            async ({ getArgs }) => {
                const found = await service.findUser(getArgs(user))

                expect(found).not.toBeNull()
                expect(found).toEqual(user)
            },
        )
    })

    describe('find many ', () => {
        beforeAll(async () => {
            await testModule.cleanDb()
            await Promise.all([
                userMock.random.createOne(
                    { email: 'koko@gmail.com', userName: 'kokoalala' },
                    testModule,
                ),
                userMock.random.createOne(
                    { email: 'koko@email.com', userName: 'kokobelelele' },
                    testModule,
                ),
            ])
        })

        it.each([
            { args: { userName: 'koko' }, text: 'username' },
            { args: { email: 'koko' }, text: 'email' },
            {
                args: { email: 'koko', userName: 'koko' },
                text: 'username and email',
            },
        ] satisfies { args: FindUserRequest; text: string }[])(
            'should find user by $text',
            async ({ args }) => {
                const found = await service.findMany(args)

                expect(found).toHaveLength(2)
            },
        )
    })
})
