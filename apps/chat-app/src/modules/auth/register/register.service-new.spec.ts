import { userMock } from '@root/common/test-utilities/mocks/user'
import { BadRequestException } from '@nestjs/common'
import { TestModule, getTestModule } from '@root/common/test-utilities/test-app/no-interface'
import { describe, beforeAll, beforeEach, it, expect } from 'vitest'
import { RegisterRequest } from '../dto/register.dto'
import { RegisterService } from './register.service'
import { UserAlreadyExistsError } from './exceptions'

describe('RegisterService', () => {
    let service: RegisterService
    let testModule: TestModule

    beforeAll(async () => {
        testModule = await getTestModule({ providers: [RegisterService] })
        service = testModule.module.get<RegisterService>(RegisterService)
    })

    beforeEach(async () => {
        await testModule.cleanDb()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should create user and retrieve it', async () => {
        const created = await service.register(userMock.random.getOne())

        const found = await testModule.repositories.user.findByUserName(created.data.userName)

        expect(found).not.toBeNull()
        expect(found?.id).toMatchObject(created.id)
    })

    it.each([
        { overrides: { email: 'not-email' }, text: 'email is not valid' },
        { overrides: { password: '123' }, text: 'password is weak' },
    ] satisfies { overrides: Partial<RegisterRequest>; text: string }[])(
        'should throw error, when ',
        async ({ overrides }) => {
            await expect(service.register(userMock.random.getOne(overrides))).rejects.toThrow(
                BadRequestException,
            )
        },
    )

    it('should throw when user already exists', async () => {
        const user = userMock.random.getOne()
        await testModule.repositories.user.createOne(user)

        await expect(service.register(user)).rejects.toThrow(UserAlreadyExistsError)
    })
})
