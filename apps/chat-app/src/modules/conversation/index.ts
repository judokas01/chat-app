import { Module } from '@nestjs/common'
import { ConfigService } from '@root/common/config/config-service.service'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { PrismaConversationRepository } from './repository/prisma/conversation/conversation.repository'
import { IConversationRepository } from './repository/IConversationRepository'

@Module({
    providers: [
        { provide: IConversationRepository, useClass: PrismaConversationRepository },
        ConfigService,
        PrismaService,
    ],
})
export class ConversationModule {}
