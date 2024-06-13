import { Inject, Injectable } from '@nestjs/common'
import { User, UserInput } from '@root/common/entities/user.entity'
import { IUserRepository } from '../repository/user-repository.interface'

@Injectable()
export class RegisterService {
    constructor(@Inject(IUserRepository) private prismaRepository: IUserRepository) {}

    async register(user: UserInput): Promise<User> {
        const found = await this.prismaRepository.findByUserName(user.userName)

        if (found) {
            throw new Error('User already exists')
        }

        return await this.prismaRepository.createOne(user)
    }
}
