import { HttpException, HttpStatus } from '@nestjs/common'

export class AuthTokenExpiredError extends HttpException {
    constructor() {
        super('Token expired.', HttpStatus.UNAUTHORIZED)
    }
}
