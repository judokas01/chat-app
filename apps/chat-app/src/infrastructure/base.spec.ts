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
                name: 'as',
                password: 'asd',
            },
        })

        const found = await prisma.user.findFirst({
            where: {
                id: '60d599cb001ef98000f2cad2',
            },
        })

        expect(found).not.toBeNull()
        expect(found).toMatchObject(saved)
    })
})
