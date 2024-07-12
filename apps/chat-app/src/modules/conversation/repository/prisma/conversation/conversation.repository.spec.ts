import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { PrismaConversationRepository } from './conversation.repository'

describe('PrismaConversationRepository', () => {
    let service: PrismaConversationRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaConversationRepository],
        }).compile()

        service = module.get<PrismaConversationRepository>(PrismaConversationRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
