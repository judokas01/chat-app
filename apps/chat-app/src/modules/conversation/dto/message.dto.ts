import { IsNotEmpty, IsString } from 'class-validator'

class Pagination {
    @IsString()
    cursor: string

    @IsNotEmpty()
    limit: number
}

class MessageAuthor {
    @IsString()
    id: string

    @IsString()
    userName: string

    @IsString()
    email: string
}

export class SendMessageRequest {
    @IsNotEmpty()
    @IsString()
    text: string

    @IsNotEmpty()
    @IsString()
    authorId: string

    @IsNotEmpty()
    @IsString()
    conversationId: string
}

export class GetMessagesRequest {
    @IsString()
    @IsNotEmpty()
    conversationId: string

    @IsNotEmpty()
    pagination: Pagination
}

export class MessageResponse {
    id: string

    text: string

    conversationId: string

    author: MessageAuthor

    createdAt: Date

    isRemoved: boolean
}

export class GetMessagesResponse {
    messages: MessageResponse[]

    cursor: string

    hasMore: boolean
}
