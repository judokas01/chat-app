import { IsNotEmpty } from 'class-validator'

export class SendMessageRequest {
    @IsNotEmpty()
    text: string

    @IsNotEmpty()
    authorId: string

    @IsNotEmpty()
    conversationId: string
}

export class GetMessagesRequest {
    @IsNotEmpty()
    conversationId: string

    @IsNotEmpty()
    pagination: Pagination
}

class Pagination {
    cursor: string

    @IsNotEmpty()
    limit: number
}
