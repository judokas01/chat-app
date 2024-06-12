import { User, UserInput } from '@root/common/entities/user.entity'

export interface IUserRepository {
    createOne: (user: UserInput) => Promise<User>
    findByUserName: (user: User['userName']) => Promise<User | null>
}
