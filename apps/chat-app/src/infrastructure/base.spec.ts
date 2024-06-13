import { env } from 'process'
import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

describe('AppController', () => {
    let prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

    beforeAll(async () => {
        console.log(env.DATABASE_URL)
        prisma = new PrismaClient()
        await prisma.$connect()
    })

    afterAll(async () => {
        await prisma.user.deleteMany()
        await prisma.$disconnect()
    })

    it('do something with prisma', async () => {
        const saved = await prisma.user.create({
            data: {
                email: 'asd',
                password: 'asd',
                userName: 'asd',
            },
        })

        const found = await prisma.user.findFirst({
            where: {
                id: saved.id,
            },
        })

        expect(found).not.toBeNull()
        expect(found).toMatchObject(saved)
    })
})
