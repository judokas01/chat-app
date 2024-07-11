import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { ConfigService } from '@root/common/config/config-service.service'
import { IAuthenticateService } from '../authenticate.interface'
import { AuthTokenExpiredError } from '../exceptions'

@Injectable()
export class JwtAuthenticateService implements IAuthenticateService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    canActivate = async (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            await this.jwtService.verifyAsync(token, {
                secret: this.configService.config.auth.jwt.secret,
            })
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new AuthTokenExpiredError()
            }
            throw new UnauthorizedException()
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.get('authorization')?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
