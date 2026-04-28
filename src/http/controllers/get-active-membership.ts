import { FastifyReply, FastifyRequest } from 'fastify'

import { UserAlreadyHaveMembershipError } from '@/use-cases/errors/user-already-have-membership'

import { makeActiveMembershipUseCase } from '@/use-cases/factories/make-active-membership-use-case'

export async function getActiveMembership(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = String(request.headers['x-user-id'])

  try {
    const getActiveMembershipUseCase = makeActiveMembershipUseCase()

    const { activeMembership } = await getActiveMembershipUseCase.execute({
      userId,
    })

    return reply.status(200).send({ activeMembership })
  } catch (err) {
    if (err instanceof UserAlreadyHaveMembershipError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(201).send()
  }
}
