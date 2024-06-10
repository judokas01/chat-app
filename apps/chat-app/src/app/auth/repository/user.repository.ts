import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../infrastructure/prisma/prisma.service'

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany()
    }
}
