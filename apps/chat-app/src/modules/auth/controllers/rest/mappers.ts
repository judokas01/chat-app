import { RegisteredUser } from '@root/modules/auth/dto/register.dto'
import { RegisterService } from '@root/modules/auth/register/register.service'

export const toRegisterResponse = ({
    data: { createdAt, email, id, userName },
}: Awaited<ReturnType<RegisterService['register']>>): RegisteredUser => ({
    createdAt,
    email,
    id,
    userName,
})
