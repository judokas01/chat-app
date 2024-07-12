import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth'
import { apolloModule } from './common/graphql/apollo'
import { ConversationModule } from './modules/conversation'

@Module({
    imports: [AuthModule, apolloModule, ConversationModule],
    providers: [],
})
export class AppModule {}
