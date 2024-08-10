import { Inject, Injectable, ValidationPipe } from '@nestjs/common'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { FindUserRequest } from '../dto/find-user.dto'

@Injectable()
export class FindUserService {
    constructor(
        @Inject(IUserRepository) private userRepository: IUserRepository,
        private readonly validationPipe: ValidationPipe,
    ) {}

    findUser = async (args: FindUserRequest) => {
        const { email, userName }: FindUserRequest = await this.validationPipe.transform(args, {
            metatype: FindUserRequest,
            type: 'body',
        })

        return await this.userRepository.findOne({ email, userName })
    }

    findMany = async (args: FindUserRequest) => {
        const { email, userName }: FindUserRequest = await this.validationPipe.transform(args, {
            metatype: FindUserRequest,
            type: 'body',
        })

        const users = await this.userRepository.findManyByPartial({ email, userName })
        return users
    }
}
