import { Test, TestingModule } from '@nestjs/testing'
import { GqlController } from './gql.controller'

describe('GqlController', () => {
    let controller: GqlController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GqlController],
        }).compile()

        controller = module.get<GqlController>(GqlController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
