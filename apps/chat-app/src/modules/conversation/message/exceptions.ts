import { HttpException, HttpStatus } from '@nestjs/common'

export class ConversationNotFoundError extends HttpException {
    constructor() {
        super('Conversation does not exist.', HttpStatus.BAD_REQUEST)
    }
}

export class InvalidConversationUserError extends HttpException {
    constructor() {
        super('Conversation does not exist.', HttpStatus.BAD_REQUEST)
    }
}
