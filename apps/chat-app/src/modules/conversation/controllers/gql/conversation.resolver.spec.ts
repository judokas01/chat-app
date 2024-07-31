import { Test, TestingModule } from '@nestjs/testing'
import { describe, beforeEach, it, expect } from 'vitest'
import { ConversationResolver } from './conversation.resolver'

describe('ConversatinResolver', () => {
    let resolver: ConversationResolver

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConversationResolver],
        }).compile()

        resolver = module.get<ConversationResolver>(ConversationResolver)
    })

    it('should be defined', () => {
        expect(resolver).toBeDefined()
    })
})
