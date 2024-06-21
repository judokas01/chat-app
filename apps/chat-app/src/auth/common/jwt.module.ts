import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@root/common/config/config-service.service'

export const JWT = JwtModule.registerAsync({
    extraProviders: [ConfigService],
    global: true,
    inject: [ConfigService],
    // eslint-disable-next-line require-await
    useFactory: async (configService: ConfigService) => {
        const { expiresIn, secret } = configService.config.auth.jwt
        return {
            secretOrPrivateKey: secret,
            signOptions: {
                expiresIn: expiresIn,
            },
        }
    },
})
