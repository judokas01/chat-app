import { getMockContext } from '@root/common/test-utilities/mocks/contex'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { beforeAll, describe, expect, it } from 'vitest'
import { getTestModule } from '@root/common/test-utilities/test-app/module'
import { JWTPayload } from '../common/types'
import { JwtAuthenticateService } from './services/jwt-authenticate.service'
import { IAuthenticateService } from './authenticate.interface'
import { AuthTokenExpiredError } from './exceptions'

describe('AuthenticateService', () => {
    let service: IAuthenticateService
    let jwtService: JwtService

    beforeAll(async () => {
        const testModule = await getTestModule({
            providers: [{ provide: IAuthenticateService, useClass: JwtAuthenticateService }],
        })

        service = testModule.module.get<IAuthenticateService>(IAuthenticateService)
        jwtService = testModule.module.get<JwtService>(JwtService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should throw when no auth is defined', async () => {
        const context = getMockContext({ authToken: 'invalidToken' })
        await expect(service.canActivate(context)).rejects.toThrow(UnauthorizedException)
    })

    it('should return true, when jwt token is valid', async () => {
        const jwtPayload: JWTPayload = { sub: 'mockId', userName: 'mockUserName' }
        const authToken = await jwtService.signAsync(jwtPayload)
        const context = getMockContext({ authToken })
        const result = await service.canActivate(context)
        expect(result).toBe(true)
    })

    it('should return correct error, when token is expired', async () => {
        const jwtPayload: JWTPayload = { sub: 'mockId', userName: 'mockUserName' }
        const authToken = await jwtService.signAsync(jwtPayload)
        const context = getMockContext({ authToken })
        await new Promise((resolve) => setTimeout(resolve, 2100))
        await expect(service.canActivate(context)).rejects.toThrow(AuthTokenExpiredError)
    })
})
