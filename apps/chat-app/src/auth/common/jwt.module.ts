import { JwtModule } from '@nestjs/jwt'
import { JWT_EXPIRE_IN, JWT_SECRET } from '../config'

export const JWT = JwtModule.register({
    global: true,
    secret: JWT_SECRET,
    signOptions: { expiresIn: JWT_EXPIRE_IN },
})
