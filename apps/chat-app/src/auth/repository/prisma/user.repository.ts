import { Injectable } from '@nestjs/common'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { User, UserInput } from '@root/common/entities/user.entity'
import { IUserRepository } from '../user-repository.interface'
import { toCoreUser, toUserCreate } from './mappers'

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
}
