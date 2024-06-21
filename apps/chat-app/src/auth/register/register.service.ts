import { Inject, Injectable } from '@nestjs/common'
import { User, UserInput } from '@root/common/entities/user.entity'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@root/common/config/config-service.service'
import { IUserRepository } from '../repository/user-repository.interface'
import { UserAlreadyExistsError } from './exceptions'

@Injectable()
export class RegisterService {
    constructor(
        @Inject(IUserRepository) private prismaRepository: IUserRepository,
        private configService: ConfigService,
    ) {}

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
        return await bcrypt.hash(password, this.configService.config.auth.saltRounds)
    }
}
