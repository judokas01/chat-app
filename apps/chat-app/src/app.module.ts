import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { apolloModuleAutoSchemaGen, apolloModuleUseTypes } from './common/graphql/apollo'
import { ConversationModule } from './modules/conversation/conversation.module'

@Module({
    imports: [AuthModule, apolloModuleUseTypes, ConversationModule],
    providers: [],
})
export class AppModule {}

@Module({
    imports: [AuthModule, apolloModuleAutoSchemaGen, ConversationModule],
    providers: [],
})
export class AppModuleGenerateTypes {}
