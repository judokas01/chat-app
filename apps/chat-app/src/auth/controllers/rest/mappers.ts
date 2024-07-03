import { RegisteredUser } from '@root/auth/register/register.dto'
import { RegisterService } from '@root/auth/register/register.service'

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
