import { User, UserInput } from '@root/common/entities/user.entity'

export interface IUserRepository {
    createOne: (user: UserInput) => Promise<User>
    findByUserName: (userName: User['userName']) => Promise<User | null>
    findById: (id: User['id']) => Promise<User | null>
    findOne: (args: Partial<Pick<User, 'email' | 'userName'>>) => Promise<User | null>
    findManyByPartial: (args: Partial<Pick<User, 'email' | 'userName'>>) => Promise<User[]>
    findManyByIds: (ids: User['id'][]) => Promise<User[]>
    updateRenewToken: (userId: User['id'], tokenHash: string) => Promise<void>
    findRenewTokenByUserId: (userId: User['id']) => Promise<string | null>
}

export const IUserRepository = Symbol('IUserRepository')
