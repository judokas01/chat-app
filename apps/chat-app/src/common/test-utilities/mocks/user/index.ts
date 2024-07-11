import { UserInput } from '@root/common/entities/user.entity'
import { faker } from '@faker-js/faker'

const createRandomUserInput = (overrides?: Partial<UserInput>): UserInput => ({
    email: faker.internet.email(),
    password: faker.internet.password({
        length: 12,
        prefix: '@1QH!66',
    }),
    userName: faker.internet.userName(),
    ...overrides,
})

const getStrongPassword = () =>
    faker.internet.password({
        length: 12,
        prefix: '@1QH!66',
    })

export const userMock = {
    random: {
        getOne: createRandomUserInput,
        getStrongPassword,
    },
}
