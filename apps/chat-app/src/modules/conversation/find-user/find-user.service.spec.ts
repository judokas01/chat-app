import { describe, beforeEach, it, expect } from 'vitest'
import { getTestModule, TestModule } from '@root/common/test-utilities/test-app/no-interface'
import { faker } from '@faker-js/faker'
import { FindUserRequest } from '../dto/find-user.dto'
import { FindUserService } from './find-user.service'

describe('FindUserService', () => {
    let testModule: TestModule
    let service: FindUserService

    beforeEach(async () => {
        testModule = await getTestModule({ providers: [FindUserService] })

        service = testModule.module.get<FindUserService>(FindUserService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('validation pipe tests', () => {
        it('should throw when no argument is passed', async () => {
            await expect(service.findUser({})).rejects.toThrow('Bad Request')
        })

        it('should throw when no invalid argument is passed', async () => {
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
})
