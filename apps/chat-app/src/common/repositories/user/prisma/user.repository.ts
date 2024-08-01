import { Injectable } from '@nestjs/common'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { User, UserInput } from '@root/common/entities/user.entity'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { toCoreUser, toUpsertRenewToken, toUserCreate } from './mappers'

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(private prisma: PrismaService) {}

    async createOne(input: UserInput): Promise<User> {
        const created = await this.prisma.user.create({ data: toUserCreate(input) })
        return toCoreUser(created)
    }

    async findByUserName(userName: User['userName']): Promise<User | null> {
        const found = await this.prisma.user.findFirst({ where: { userName } })

        return found ? toCoreUser(found) : null
    }

    async findById(id: User['id']): Promise<User | null> {
        const found = await this.prisma.user.findFirst({ where: { id } })

        return found ? toCoreUser(found) : null
    }

    async findOne(args: Partial<Pick<User, 'email' | 'userName'>>): Promise<User | null> {
        const found = await this.prisma.user.findFirst({ where: args })

        return found ? toCoreUser(found) : null
    }

    async findManyByPartial({
        email,
        userName,
    }: Partial<Pick<User, 'email' | 'userName'>>): Promise<User[]> {
        const found = await this.prisma.user.findMany({
            where: {
                email: {
                    contains: email,
                },
                userName: {
                    contains: userName,
                },
            },
        })

        return found.map(toCoreUser)
    }

    async findManyByIds(ids: User['id'][]): Promise<User[]> {
        const found = await this.prisma.user.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return found.map(toCoreUser)
    }

    async updateRenewToken(userId: User['id'], token: string): Promise<void> {
        await this.prisma.userRenewToken.upsert(toUpsertRenewToken(userId, token))
    }

    async findRenewTokenByUserId(userId: User['id']): Promise<string | null> {
        const found = await this.prisma.userRenewToken.findFirst({
            where: { userId },
        })

        return found?.token ?? null
    }
}
