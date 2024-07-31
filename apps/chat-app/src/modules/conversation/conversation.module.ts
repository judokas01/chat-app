import { Module } from '@nestjs/common'
import { ConfigService } from '@root/common/config/config-service.service'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { IConversationRepository } from '../../common/repositories/conversation.repository'
import { PrismaConversationRepository } from '../../common/repositories/conversation/prisma/conversation.repository'
import { CreateConversationService } from './create-conversation/create-conversation.service'
import { MessageService } from './message/send-message.service'
import { ConversationController } from './controllers/rest/conversation.controller'
import { ConversationResolver } from './controllers/gql/conversation.resolver'
import { GetConversationService } from './get-conversation/get-conversation.service'
import { FindUserService } from './find-user/find-user.service'

@Module({
    controllers: [ConversationController],
    providers: [
        { provide: IConversationRepository, useClass: PrismaConversationRepository },
        ConfigService,
        PrismaService,
        CreateConversationService,
        MessageService,
        ConversationResolver,
        GetConversationService,
        FindUserService,
    ],
})
export class ConversationModule {}
