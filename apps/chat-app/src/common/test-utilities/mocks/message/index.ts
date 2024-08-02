import { Conversation } from '@root/common/entities/conversation.entity'
import { HasOne } from '@root/common/entities/common/Relationship'
import { MessageInput } from '@root/common/entities/message.entity'
import { faker } from '@faker-js/faker'
import { User } from '@root/common/entities/user.entity'

const getOneRandomMessage = ({
    author = new HasOne<User>(undefined, 'message.author'),
    conversation = new HasOne<Conversation>(undefined, 'message.conversation'),
    text = faker.lorem.sentence(),
}: Partial<MessageInput> = {}): MessageInput => ({ author, conversation, text })

export const messageMock = {
    getOneData: getOneRandomMessage,
}
