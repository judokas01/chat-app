import { Inject, Injectable } from '@nestjs/common'
import { User, UserInput } from '@root/common/entities/user.entity'
import * as bcrypt from 'bcrypt'
import { IUserRepository } from '../repository/user-repository.interface'
import { AUTH_MODULE_SALT_ROUNDS } from '../config'
import { UserAlreadyExistsError } from './exceptions'

@Injectable()
export class RegisterService {
    constructor(@Inject(IUserRepository) private prismaRepository: IUserRepository) {}

    async register(user: UserInput): Promise<User> {
        const found = await this.prismaRepository.findByUserName(user.userName)

        if (found) {
            throw new UserAlreadyExistsError()
        }

        return await this.prismaRepository.createOne({
            ...user,
            password: await this.hashPassword(user.password),
        })
    }

    private hashPassword = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, AUTH_MODULE_SALT_ROUNDS)
    }
}
