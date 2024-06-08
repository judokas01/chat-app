import { Module } from '@nestjs/common'

import { PrismaService } from '../infrastructure/prisma/prisma.service'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    controllers: [AppController],
    imports: [],
    providers: [AppService, PrismaService],
})
export class AppModule {}
