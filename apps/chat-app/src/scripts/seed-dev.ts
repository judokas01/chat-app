import { faker } from '@faker-js/faker'
import { AppModule } from '@root/app.module'
import { IAuthGuard } from '@root/common/guards/authenticate/authenticate.guard'
import { JwtAuthGuard } from '@root/common/guards/authenticate/services/jwt-authenticate.service'
import { conversationMock } from '@root/common/test-utilities/mocks/conversation'
import { userMock } from '@root/common/test-utilities/mocks/user'
import { getTestModuleWithInterface } from '@root/common/test-utilities/test-app/interface'

const exec = async () => {
    const testModule = await getTestModuleWithInterface({
        module: AppModule,
        providers: [{ provide: IAuthGuard, useClass: JwtAuthGuard }],
    })
    await testModule.cleanDb()

    const userWithoutConversation = await userMock.random.createOne({}, testModule)

    const { conversation, users } = await conversationMock.createOne(
        {
            conversation: {
                lastMessageAt: null,
                name: faker.internet.userName(),
            },
        },
        testModule,
    )

    console.log({
        conversation: conversation.data,
        userWithoutConversation: userWithoutConversation.data,
        users: users.map((u) => u.data),
    })

    await testModule.destroy()
}
exec()
