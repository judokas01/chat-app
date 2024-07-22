import { Test, TestingModule } from '@nestjs/testing'
import { describe, beforeEach, it, expect } from 'vitest'
import { MessageService } from './send-message.service'

describe('SendMessageService', () => {
    let service: MessageService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessageService],
        }).compile()

        service = module.get<MessageService>(MessageService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
