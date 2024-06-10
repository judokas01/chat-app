import { Module } from '@nestjs/common'

import { PrismaService } from './infrastructure/prisma/prisma.service'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'

@Module({
    controllers: [AppController],
    imports: [AuthModule],
    providers: [AppService, PrismaService],
})
export class AppModule {}
