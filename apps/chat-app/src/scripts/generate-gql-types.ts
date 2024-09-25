/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core'

import { AppModuleGenerateTypes } from '../app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModuleGenerateTypes, { logger: false })
    const globalPrefix = process.env.API_PREFIX || 'api'
    app.setGlobalPrefix(globalPrefix)
    const port = process.env.PORT || 3000
    await app.listen(port)
    await app.close()
    console.debug(`🚀 GQL SCHEMA WAS GENERATED`)
}

bootstrap()
