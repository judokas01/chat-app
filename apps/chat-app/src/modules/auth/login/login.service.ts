import { randomUUID } from 'crypto'
import { Inject, Injectable, ValidationPipe } from '@nestjs/common'
import { User } from '@root/common/entities/user.entity'
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@root/common/config/config-service.service'
import { IUserRepository } from '../../../common/repositories/user.repository'
import { JWTPayload } from '../common/types'
import { LoginRequest, LoginServiceResult, RenewRequest } from '../dto/login.dto'
import { InvalidPasswordError, InvalidRenewTokenRequestError } from './exceptions'

@Injectable()
export class LoginService {
    constructor(
        @Inject(IUserRepository) private prismaRepository: IUserRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly validationPipe: ValidationPipe,
    ) {}

    login = async (loginReq: LoginRequest): Promise<LoginServiceResult> => {
        const { password, userName }: LoginRequest = await this.validationPipe.transform(loginReq, {
            metatype: LoginRequest,
            type: 'body',
        })

        const user = await this.prismaRepository.findByUserName(userName)

        if (!user) {
            throw new InvalidPasswordError()
        }

        const isPasswordValid = await bcrypt.compare(password, user.data.password)

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        const [accessToken, renewToken] = await Promise.all([
            this.getJwtToken(user),
            this.createRenewToken(user.id),
        ])

        return {
            accessToken,
            renewToken,
        }
    }

    renewToken = async (args: RenewRequest): Promise<LoginServiceResult> => {
        const { authToken, renewToken }: RenewRequest = await this.validationPipe.transform(args, {
            metatype: RenewRequest,
            type: 'body',
        })

        const authTokenPayload: JWTPayload | null = this.jwtService.decode(authToken)
        if (!authTokenPayload) {
            throw new InvalidRenewTokenRequestError()
        }

        const user = await this.prismaRepository.findById(authTokenPayload.sub)

        const storedRenewToken = await this.prismaRepository.findRenewTokenByUserId(
            authTokenPayload.sub,
        )

        const isRenewTokenValid = await bcrypt.compare(renewToken, storedRenewToken ?? '')

        if (!user || !storedRenewToken || !isRenewTokenValid) {
            throw new InvalidRenewTokenRequestError()
        }

        const [newAccessToken, newRenewToken] = await Promise.all([
            this.getJwtToken(user),
            this.createRenewToken(user.id),
        ])

        return {
            accessToken: newAccessToken,
            renewToken: newRenewToken,
        }
    }

    private createRenewToken = async (userId: string): Promise<string> => {
        const token = randomUUID()

        const hashedToken = await bcrypt.hash(token, this.configService.config.auth.saltRounds)

        await this.prismaRepository.updateRenewToken(userId, hashedToken)

        return token
    }

    private getJwtToken = async (user: User): Promise<string> => {
        const jwtPayload: JWTPayload = { sub: user.id, userName: user.data.userName }
        return await this.jwtService.signAsync(jwtPayload)
    }
}
