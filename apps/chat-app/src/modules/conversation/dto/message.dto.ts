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

export class MessageResponse {
    id: string

    text: string

    author: MessageAuthor

    createdAt: Date

    isRemoved: boolean
}

class MessageAuthor {
    id: string

    userName: string

    email: string
}

export class GetMessagesResponse {
    messages: MessageResponse[]

    cursor: string

    hasMore: boolean
}
