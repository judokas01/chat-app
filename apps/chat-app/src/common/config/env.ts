import { cleanEnv, str, num } from 'envalid'

export const getValidatedEnv = (invalidatedEnv: unknown) =>
    cleanEnv(invalidatedEnv, {
        API_PREFIX: str({ default: 'api' }),
        AUTH_MODULE_SALT_ROUNDS: num(),
        DATABASE_URL: str(),
        JWT_EXPIRE_IN: str(),
        JWT_SECRET: str(),
        PORT: str({ default: '3000' }),
    })

export const chatAppConfig = (invalidatedEnv: unknown = process.env) => {
    const validatedEnv = getValidatedEnv(invalidatedEnv)

    return {
        auth: {
            jwt: {
                expiresIn: validatedEnv.JWT_EXPIRE_IN,
                secret: validatedEnv.JWT_SECRET,
            },
            saltRounds: validatedEnv.AUTH_MODULE_SALT_ROUNDS,
        },
    }
}

export type ChatAppConfig = ReturnType<typeof chatAppConfig>
