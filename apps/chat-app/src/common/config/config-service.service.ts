import { Injectable } from '@nestjs/common'
import { ChatAppConfig, chatAppConfig } from './env'

@Injectable()
export class ConfigService {
    public config: ChatAppConfig

    constructor() {
        this.config = chatAppConfig()
    }
}
