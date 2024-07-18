import { Module } from '@nestjs/common'
import { ConfigService } from '@root/common/config/config-service.service'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { IConversationRepository } from '../../common/repositories/conversation.repository'
import { PrismaConversationRepository } from '../../common/repositories/conversation/prisma/conversation/conversation.repository'

@Module({
    providers: [
        { provide: IConversationRepository, useClass: PrismaConversationRepository },
        ConfigService,
        PrismaService,
    ],
})
export class ConversationModule {}
