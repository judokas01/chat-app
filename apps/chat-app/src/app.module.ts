import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { apolloModule } from './common/graphql/apollo'
import { ConversationModule } from './modules/conversation/conversation.module'

@Module({
    imports: [AuthModule, apolloModule, ConversationModule],
    providers: [],
})
export class AppModule {}
