import { Inject, Injectable } from '@nestjs/common'
import { User, UserInput } from '@root/common/entities/user.entity'
import bcrypt from 'bcrypt'
import { IUserRepository } from '../repository/user-repository.interface'
import { InvalidPasswordError, UserNotFoundError } from './login.exeptions'

@Injectable()
export class LoginService {
    constructor(@Inject(IUserRepository) private prismaRepository: IUserRepository) {}

    async login({ password, userName }: Pick<UserInput, 'userName' | 'password'>): Promise<User> {
        const found = await this.prismaRepository.findByUserName(userName)

        if (!found) {
            throw new UserNotFoundError()
        }

        const isPasswordValid = await bcrypt.compare(password, found.password)

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        return found
    }
}
