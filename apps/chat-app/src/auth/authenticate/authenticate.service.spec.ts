import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext } from '@nestjs/common'
import { JWT } from '../common/jwt.module'
import { JwtAuthenticateService } from './services/jwt-authenticate.service'
import { IAuthenticateService } from './authenticate.interface'

describe('AuthenticateService', () => {
    let service: IAuthenticateService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JWT],
            providers: [{ provide: IAuthenticateService, useClass: JwtAuthenticateService }],
        }).compile()

        service = module.get<IAuthenticateService>(IAuthenticateService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should throw when no auth is defined', async () => {
        const context: ExecutionContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        get: () => ({}),
                    },
                }),
            }),
        }
        await expect(service.canActivate(context)).rejects.toThrow()
    })
})
