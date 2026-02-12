import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/errors/use-already-exists-error'
import { PrismaMembershipRepository } from '@/repositories/prisma/prisma-membership-repository'
import { MembershipUseCase } from '@/use-cases/membership'

export async function membership(request: FastifyRequest, reply: FastifyReply) {
  const membershipBodySchema = z.object({
    plan: z.enum(['MONTHLY', 'YEARLY']),
  })

  const { plan } = membershipBodySchema.parse(request.body)

  const userId = String(request.headers['x-user-id'])

  try {
    const membershipRepository = new PrismaMembershipRepository()

    const membershipUseCase = new MembershipUseCase(membershipRepository)

    await membershipUseCase.execute({
      userId,
      plan,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(201).send()
  }

  return reply.status(201).send()
}
