import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidPasswordError extends HttpException {
    constructor() {
        super('Invalid username and password combination.', HttpStatus.BAD_REQUEST)
    }
}

export class InvalidRenewTokenRequestError extends HttpException {
    constructor() {
        super('Invalid renew token request.', HttpStatus.BAD_REQUEST)
    }
}
