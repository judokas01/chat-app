import { Inject, Injectable, ValidationPipe } from '@nestjs/common'
import { User } from '@root/common/entities/user.entity'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@root/common/config/config-service.service'
import { HasMany } from '@root/common/entities/common/Relationship'
import { IUserRepository } from '../../../common/repositories/user.repository'
import { UserAlreadyExistsError } from './exceptions'
import { RegisterRequest } from './register.dto'

@Injectable()
export class RegisterService {
    constructor(
        @Inject(IUserRepository) private prismaRepository: IUserRepository,
        private configService: ConfigService,
        private readonly validationPipe: ValidationPipe,
    ) {}

    async register(request: RegisterRequest): Promise<User> {
        const validated: RegisterRequest = await this.validationPipe.transform(request, {
            metatype: RegisterRequest,
            type: 'body',
        })

        const found = await this.prismaRepository.findByUserName(validated.userName)

        if (found) {
            throw new UserAlreadyExistsError()
        }

        return await this.prismaRepository.createOne({
            ...validated,
            conversations: new HasMany([], 'user.conversations'),
            password: await this.hashPassword(validated.password),
        })
    }

    private hashPassword = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, this.configService.config.auth.saltRounds)
    }
}
