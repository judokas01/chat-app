import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JWT_SECRET } from '@root/auth/config'
import { JWTPayload } from '@root/auth/common/types'
import { IAuthenticateService } from '../authenticate.interface'

@Injectable()
export class JwtAuthenticateService implements IAuthenticateService {
    constructor(private jwtService: JwtService) {}

    canActivate = async (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            const payload = (await this.jwtService.verifyAsync(token, {
                secret: JWT_SECRET,
            })) as JWTPayload | null
        } catch {
            throw new UnauthorizedException()
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.get('authorization')?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
