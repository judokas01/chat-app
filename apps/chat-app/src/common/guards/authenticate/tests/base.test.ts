import { afterAll, beforeAll, beforeEach, describe, expect, it, vitest } from 'vitest'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@root/common/config/config-service.service'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { INestApplication, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import supertest from 'supertest'
import { JWTPayload } from '@root/modules/auth/common/types'
import { JWT } from '@root/modules/auth/common/jwt.module'
import { faker } from '@faker-js/faker'
import { subSeconds } from 'date-fns'
import { IAuthGuard } from '../authenticate.guard'
import { AlwaysAuthenticatedAuthenticateService } from '../services/always-authenticated-authenticate.service'
import { JwtAuthGuard } from '../services/jwt-authenticate.service'
import { GuardTestingApiGql, GuardTestingApiRest } from './test-utils'

const url = `http://localhost:3000/api`
const gqlUrl = `http://localhost:3000/graphql`

describe('YourController', () => {
    describe('jwt guard tests', () => {
        let app: INestApplication
        let service: JwtService

        beforeAll(async () => {
            @Module({
                controllers: [GuardTestingApiRest],
                imports: [
                    GraphQLModule.forRoot<ApolloDriverConfig>({
                        autoSchemaFile: true,
                        driver: ApolloDriver,
                    }),
                    JWT,
                ],
                providers: [
                    GuardTestingApiGql,
                    { provide: IAuthGuard, useClass: JwtAuthGuard },
                    ConfigService,
                ],
            })
            class TestAppMod {}

            app = await NestFactory.create(TestAppMod, { logger: false })
            service = app.get<JwtService>(JwtService)
            await app.listen(3000)
        })

        afterAll(async () => {
            await app.close()
        })

        describe('when passing valid token', () => {
            let token: string
            beforeEach(async () => {
                const jwtPayload: JWTPayload = { sub: 'someId', userName: 'someUser' }
                token = `Bearer ` + (await service.signAsync(jwtPayload))
            })

            it('should return status 200 from guarded endpoint', async () => {
                const result = await supertest(url).get('/guarded').set({ authorization: token })
                expect(result.status).toBe(200)
            })

            it('should return status 200 from EP without guard', async () => {
                const result = await supertest(url).get('/free').set({ authorization: token })
                expect(result.status).toBe(200)
            })

            it('should return result from guarded gql query  - aa', async () => {
                const result = await supertest(gqlUrl)
                    .post('')
                    .set({ authorization: token })
                    .send({ query: '{ guarded }' })

                expect(result.body).toMatchObject({ data: { guarded: 'guarded' } })
            })

            it('should return result from free gql query', async () => {
                const result = await supertest(gqlUrl)
                    .post('')
                    .send({ query: '{ free }' })
                    .set({ authorization: token })
                expect(result.body).toMatchObject({ data: { free: 'free' } })
            })
        })

        describe('when passing invalid token', () => {
            const token = faker.string.uuid()
            it('should return status 401 from guarded endpoint - aa', async () => {
                const result = await supertest(url).get('/guarded').set({ authorization: token })
                expect(result.status).toBe(401)
            })

            it('should return status 200 from EP without guard', async () => {
                const result = await supertest(url).get('/free').set({ authorization: token })
                expect(result.status).toBe(200)
            })

            it('should return result from guarded gql query', async () => {
                const result = await supertest(gqlUrl)
                    .post('')
                    .send({ query: '{ guarded }' })
                    .set({ authorization: token })

                expect(result.body).toMatchSnapshot()
            })

            it('should return result from free gql query', async () => {
                const result = await supertest(gqlUrl)
                    .post('')
                    .send({ query: '{ free }' })
                    .set({ authorization: token })
                expect(result.body).toMatchObject({ data: { free: 'free' } })
            })
        })

        describe('when passing expired token', () => {
            let token: string
            beforeEach(async () => {
                vitest.useFakeTimers()
                vitest.setSystemTime(subSeconds(new Date(), 10))
                const jwtPayload: JWTPayload = { sub: 'someId', userName: 'someUser' }
                token = `Bearer ` + (await service.signAsync(jwtPayload))
                vitest.useRealTimers()
            })

            it('should return status 401 from guarded endpoint - aa', async () => {
                const result = await supertest(url).get('/guarded').set({ authorization: token })
                expect(result.status).toBe(401)
                expect(result.body).toMatchSnapshot()
            })

            it('should return result from guarded gql query', async () => {
                const result = await supertest(gqlUrl)
                    .post('')
                    .send({ query: '{ guarded }' })
                    .set({ authorization: token })

                expect(result.body).toMatchSnapshot()
            })
        })
    })

    describe('always authorized guard tests', () => {
        let app: INestApplication
        beforeAll(async () => {
            @Module({
                controllers: [GuardTestingApiRest],
                imports: [
                    GraphQLModule.forRoot<ApolloDriverConfig>({
                        autoSchemaFile: true,
                        driver: ApolloDriver,
                    }),
                ],
                providers: [
                    GuardTestingApiGql,
                    { provide: IAuthGuard, useClass: AlwaysAuthenticatedAuthenticateService },
                ],
            })
            class TestAppMod {}

            app = await NestFactory.create(TestAppMod, { logger: false })
            await app.listen(3000)
        })

        afterAll(async () => {
            await app.close()
        })

        it('should return status 200 from guarded endpoint', async () => {
            const result = await supertest(url).get('/guarded')
            expect(result.status).toBe(200)
        })

        it('should return status 200 from EP without guard', async () => {
            const result = await supertest(url).get('/free')
            expect(result.status).toBe(200)
        })

        it('should return result from guarded gql query', async () => {
            const result = await supertest(gqlUrl).post('').send({ query: '{ guarded }' })
            expect(result.body).toMatchObject({ data: { guarded: 'guarded' } })
        })

        it('should return result from free gql query', async () => {
            const result = await supertest(gqlUrl).post('').send({ query: '{ free }' })
            expect(result.body).toMatchObject({ data: { free: 'free' } })
        })
    })
})
