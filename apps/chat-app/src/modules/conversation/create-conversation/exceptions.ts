import { HttpException, HttpStatus } from '@nestjs/common'

export class UserNotFound extends HttpException {
    constructor(userId: string) {
        super(`Requested user was not found by id ${userId}`, HttpStatus.NOT_FOUND)
    }
}
