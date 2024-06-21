import { Module } from '@nestjs/common'

import { PrismaService } from './infrastructure/prisma/prisma.service'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { ConfigService } from './common/config/config-service.service'

@Module({
    controllers: [AppController],
    imports: [AuthModule],
    providers: [AppService, PrismaService, ConfigService],
})
export class AppModule {}
