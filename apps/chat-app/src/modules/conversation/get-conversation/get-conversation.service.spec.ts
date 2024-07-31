import { Test, TestingModule } from '@nestjs/testing'
import { describe, beforeEach, it, expect } from 'vitest'
import { GetConversationService } from './get-conversation.service'

describe('GetConversationService', () => {
    let service: GetConversationService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GetConversationService],
        }).compile()

        service = module.get<GetConversationService>(GetConversationService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
