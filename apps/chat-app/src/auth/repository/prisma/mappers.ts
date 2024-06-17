import { Prisma, User as PrismaUser } from '@prisma/client'
import { User, UserInput } from '@root/common/entities/user.entity'

export const toUserCreate = (input: UserInput): Prisma.UserCreateInput => ({
    email: input.email,
    password: input.password,
    userName: input.userName,
})

export const toCoreUser = (user: PrismaUser): User => ({
    createdAt: user.createdAt,
    email: user.email,
    id: user.id,
    password: user.password,
    userName: user.userName,
})

export const toUpsertRenewToken = (
    userId: User['id'],
    token: string,
): Prisma.UserRenewTokenUpsertArgs => ({
    create: { createdAt: new Date(), token: token, userId },
    update: { createdAt: new Date(), token: token, userId },
    where: { userId },
})
