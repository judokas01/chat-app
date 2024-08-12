import { HasOne } from '@root/common/entities/common/Relationship'
import { MessageInput } from '@root/common/entities/message.entity'
import { faker } from '@faker-js/faker'

const getOneRandomMessage = ({
    author = HasOne.unloaded('message.author'),
    conversation = HasOne.unloaded('message.conversation'),
    text = faker.lorem.sentence(),
}: Partial<MessageInput> = {}): MessageInput => ({ author, conversation, text })

export const messageMock = {
    getOneData: getOneRandomMessage,
}
