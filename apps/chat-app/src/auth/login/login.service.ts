import { Inject, Injectable } from '@nestjs/common'
import { UserInput } from '@root/common/entities/user.entity'
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { IUserRepository } from '../repository/user-repository.interface'
import { InvalidPasswordError, UserNotFoundError } from './login.exeptions'

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

        const payload = { sub: found.id, userName: found.userName }
        const renewToken = ''

        return {
            accessToken: await this.jwtService.signAsync(payload),
            renewToken,
        }
    }
}

export type LoginServiceResult = {
    accessToken: string
    renewToken: string
}
