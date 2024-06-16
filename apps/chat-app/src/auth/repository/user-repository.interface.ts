import { User, UserInput } from '@root/common/entities/user.entity'

export interface IUserRepository {
    createOne: (user: UserInput) => Promise<User>
    findByUserName: (user: User['userName']) => Promise<User | null>
    updateRenewToken: (userId: User['id'], tokenHash: string) => Promise<void>
    findRenewTokenByUserId: (userId: User['id']) => Promise<string | null>
}

export const IUserRepository = Symbol('IUserRepository')
