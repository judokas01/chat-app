import { Test, TestingModule } from '@nestjs/testing'
import { describe, beforeEach, it, expect } from 'vitest'
import { ConversationController } from './conversation.controller'

describe('ConversationController', () => {
    let controller: ConversationController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConversationController],
        }).compile()

        controller = module.get<ConversationController>(ConversationController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
