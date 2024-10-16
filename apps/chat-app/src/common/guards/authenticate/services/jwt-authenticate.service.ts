import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import { ConfigService } from '@root/common/config/config-service.service'
import { Request } from 'express'
import { GqlExecutionContext } from '@nestjs/graphql'
import { IAuthGuard } from '../authenticate.guard'
import { AuthTokenExpiredError } from '../exceptions'

@Injectable()
export class JwtAuthGuard implements IAuthGuard {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    canActivate = async (context: ExecutionContext) => {
        const gqlRequest = GqlExecutionContext.create(context).getContext().req
        const httpRequest = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(httpRequest ?? gqlRequest)
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
        GqlExecutionContext.create(context).getContext().user = this.jwtService.decode(token)
        gqlRequest.user = this.jwtService.decode(token)

        return true
    }

    private extractTokenFromHeader(request?: Request): string | undefined {
        const [type, token] = request?.headers?.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
