import { describe, it, beforeEach, afterEach } from 'vitest'
import {
    getTestModuleWithInterface,
    TestInterfaceModule,
} from '@root/common/test-utilities/test-app/interface'
import { conversationMock } from '@root/common/test-utilities/mocks/conversation'
import { IAuthGuard } from '@root/common/guards/authenticate/authenticate.guard'
import { JwtAuthGuard } from '@root/common/guards/authenticate/services/jwt-authenticate.service'
import { JWTPayload } from '@root/modules/auth/common/types'
import { JwtService } from '@nestjs/jwt'
import { ConversationModule } from '../../../conversation.module'

describe.skip('ConversationResolver - guard tests', () => {
    let testModule: TestInterfaceModule

    beforeEach(async () => {
        testModule = await getTestModuleWithInterface({
            module: ConversationModule,
            providers: [{ provide: IAuthGuard, useClass: JwtAuthGuard }],
        })

        await testModule.cleanDb()
    })

    afterEach(async () => {
        await testModule.destroy()
    })

    it('should throw unauthorized error when invalid token is provided', async () => {
        const { conversation, users } = await conversationMock.createOne({}, testModule)
        const service = testModule.module.get<JwtService>(JwtService)

        console.log({ conversation: conversation.id })

        users.forEach(async (user) => {
            const jwtPayload: JWTPayload = { sub: user.id, userName: user.data.userName }
            const token = `Bearer ` + (await service.signAsync(jwtPayload))
            console.log({ token, user })
        })
    })
})
