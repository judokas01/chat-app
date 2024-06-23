import { UserInput } from '@root/common/entities/user.entity'
import { faker } from '@faker-js/faker'

const createRandomUserInput = (overrides?: Partial<UserInput>): UserInput => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
    userName: faker.internet.userName(),
    ...overrides,
})

export const userMock = {
    random: {
        getOne: createRandomUserInput,
    },
}
