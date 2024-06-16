import { HttpException, HttpStatus } from '@nestjs/common'

export class UserNotFoundError extends HttpException {
    constructor() {
        super('User was not found.', HttpStatus.NOT_FOUND)
    }
}

export class InvalidPasswordError extends HttpException {
    constructor() {
        super('Invalid username and password combination.', HttpStatus.BAD_REQUEST)
    }
}
