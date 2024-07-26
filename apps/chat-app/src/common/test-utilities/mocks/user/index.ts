import { UserInput } from '@root/common/entities/user.entity'
import { faker } from '@faker-js/faker'
import { HasMany } from '@root/common/entities/common/Relationship'
import { CommonTestModule } from '@root/common/test-utilities/test-app/common/types'

const createRandomUserInput = (overrides?: Partial<UserInput>): UserInput => ({
    conversations: new HasMany(undefined, 'user.conversations'),
    email: faker.internet.email(),
    password: getStrongPassword(),
    userName: faker.internet.userName(),
    ...overrides,
})

const getStrongPassword = () =>
    faker.internet.password({
        length: 34,
        prefix: '@1QH!66',
    })

const createRandomUserOne = async (overrides: Partial<UserInput>, module: CommonTestModule) =>
    await module.repositories.user.createOne(createRandomUserInput(overrides))

export const userMock = {
    random: {
        createOne: createRandomUserOne,
        getOne: createRandomUserInput,
        getStrongPassword,
    },
}
