import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Prisma implementation test', () => {
    let prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

    beforeAll(async () => {
        prisma = new PrismaClient()
        await prisma.$connect()
    })

    afterAll(async () => {
        await prisma.userRenewToken.deleteMany()
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
