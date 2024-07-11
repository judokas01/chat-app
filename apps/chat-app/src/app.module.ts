import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { apolloModule } from './common/graphql/apollo'

@Module({
    imports: [AuthModule, apolloModule],
})
export class AppModule {}
