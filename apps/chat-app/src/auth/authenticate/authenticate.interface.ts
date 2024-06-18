import { CanActivate } from '@nestjs/common'

export interface IAuthenticateService extends CanActivate {}

export const IAuthenticateService = Symbol('IAuthenticateService')
