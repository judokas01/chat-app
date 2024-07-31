import { Inject, Injectable } from '@nestjs/common'
import { IUserRepository } from '@root/common/repositories/user.repository'
import { FindUserRequest } from '../dto/find-user.dto'

@Injectable()
export class FindUserService {
    constructor(@Inject(IUserRepository) private userRepository: IUserRepository) {}

    findUser = async (args: FindUserRequest) => {}
}
