import { JWTPayload } from '@root/modules/auth/common/types'

export type GQLContext = { req: Request; res: Response; user: JWTPayload }
