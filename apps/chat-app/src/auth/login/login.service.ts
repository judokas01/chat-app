import { Inject, Injectable } from '@nestjs/common'
import { UserInput } from '@root/common/entities/user.entity'
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { IUserRepository } from '../repository/user-repository.interface'
import { AUTH_MODULE_SALT_ROUNDS } from '../config'
import { InvalidPasswordError, UserNotFoundError } from './exceptions'

@Injectable()
export class LoginService {
    constructor(
        @Inject(IUserRepository) private prismaRepository: IUserRepository,
        private jwtService: JwtService,
    ) {}

    async login({
        password,
        userName,
    }: Pick<UserInput, 'userName' | 'password'>): Promise<LoginServiceResult> {
        const found = await this.prismaRepository.findByUserName(userName)

        if (!found) {
            throw new UserNotFoundError()
        }

        const isPasswordValid = await bcrypt.compare(password, found.password)

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        const jwtPayload = { sub: found.id, userName: found.userName }
        const renewTokenToHas = crypto.randomUUID()

        const [_, accessToken, renewToken] = await Promise.all([
            this.prismaRepository.updateRenewToken(found.id, renewTokenToHas),
            this.jwtService.signAsync(jwtPayload),
            bcrypt.hash(renewTokenToHas, AUTH_MODULE_SALT_ROUNDS),
        ])

        return {
            accessToken,
            renewToken,
        }
    }
}

export type LoginServiceResult = {
    accessToken: string
    renewToken: string
}
