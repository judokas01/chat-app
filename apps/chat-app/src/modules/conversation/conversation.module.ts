import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@root/common/config/config-service.service'
import { PrismaService } from '@root/infrastructure/prisma/prisma.service'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { UserPrismaRepository } from '@root/common/repositories/user/prisma/user.repository'
import { IMessageRepository } from '@root/common/repositories/message.repository'
import { MessagePrismaRepository } from '@root/common/repositories/message/prisma/message.repository'
import { IConversationRepository } from '../../common/repositories/conversation.repository'
import { PrismaConversationRepository } from '../../common/repositories/conversation/prisma/conversation.repository'
import { CreateConversationService } from './create-conversation/create-conversation.service'
import { MessageService } from './message/message.service'
import { ConversationController } from './controllers/rest/conversation.controller'
import { ConversationResolver } from './controllers/gql/conversation.resolver'
import { GetConversationService } from './get-conversation/get-conversation.service'
import { FindUserService } from './find-user/find-user.service'

@Module({
    controllers: [ConversationController],
    exports: [
        { provide: IConversationRepository, useClass: PrismaConversationRepository },
        { provide: IUserRepository, useClass: UserPrismaRepository },
        { provide: IMessageRepository, useClass: MessagePrismaRepository },
        ConfigService,
        PrismaService,
        CreateConversationService,
        MessageService,
        ConversationResolver,
        GetConversationService,
        FindUserService,
        ValidationPipe,
    ],
    providers: [
        { provide: IConversationRepository, useClass: PrismaConversationRepository },
        { provide: IUserRepository, useClass: UserPrismaRepository },
        { provide: IMessageRepository, useClass: MessagePrismaRepository },
        ConfigService,
        PrismaService,
        CreateConversationService,
        MessageService,
        ConversationResolver,
        GetConversationService,
        FindUserService,
        ValidationPipe,
    ],
})
export class ConversationModule {}
