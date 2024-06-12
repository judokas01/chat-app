import { Injectable } from '@nestjs/common'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { User, UserInput } from '@root/common/entities/user.entity'
import { IUserRepository } from '../user-repository.interface'

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(private prisma: PrismaService) {}

    async createOne(input: UserInput): Promise<User> {
        return this.prisma.user.create()
    }

    async findByUserName(userName: User['userName']): Promise<User | null> {
        return this.prisma.user.findFirst()
    }
}
