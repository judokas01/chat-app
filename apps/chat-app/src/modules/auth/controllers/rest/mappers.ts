import { RegisteredUser } from '@root/modules/auth/register/register.dto'
import { RegisterService } from '@root/modules/auth/register/register.service'

export const toRegisterResponse = ({
    createdAt,
    email,
    id,
    userName,
}: Awaited<ReturnType<RegisterService['register']>>): RegisteredUser => ({
    createdAt,
    email,
    id,
    userName,
})
