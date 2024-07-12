import { Injectable } from '@nestjs/common'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { IConversationRepository } from '../../IConversationRepository'

@Injectable()
export class PrismaConversationRepository implements IConversationRepository {
    constructor(private prisma: PrismaService) {}
}
