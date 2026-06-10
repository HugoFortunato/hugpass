import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { UserAlreadyHaveMembershipError } from '@/use-cases/errors/user-already-have-membership'
import { makeMembershipUseCase } from '@/use-cases/factories/make-membership'

export async function membership(request: FastifyRequest, reply: FastifyReply) {
  const membershipBodySchema = z.object({
    plan: z.enum(['MONTHLY', 'YEARLY']),
  })

  const { plan } = membershipBodySchema.parse(request.body)
  const userId = String(request.headers['x-user-id'])

  try {
    const membershipUseCase = makeMembershipUseCase()

    await membershipUseCase.execute({
      userId,
      plan,
    })
  } catch (err) {
    if (err instanceof UserAlreadyHaveMembershipError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(201).send()
  }

  return reply.status(201).send('Membership created successfully')
}
