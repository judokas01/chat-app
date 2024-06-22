import { Module } from '@nestjs/common'
import { ConfigService } from '@root/common/config/config-service.service'
import { LoginService } from './login/login.service'
import { RegisterService } from './register/register.service'
import { JwtAuthenticateService } from './authenticate/services/jwt-authenticate.service'
import { JWT } from './common/jwt.module'
import { RestController } from './controllers/rest/rest.controller'
import { GqlController } from './controllers/gql/gql.controller'

@Module({
    controllers: [RestController, GqlController],
    imports: [JWT],
    providers: [LoginService, RegisterService, JwtAuthenticateService, ConfigService],
})
export class AuthModule {}
