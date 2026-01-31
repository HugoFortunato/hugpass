import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()
export const prisma = new PrismaClient()

prisma.user.create({
  data: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
})
