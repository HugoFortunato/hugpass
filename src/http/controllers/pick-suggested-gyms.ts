import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makePickSuggestedGymsUseCase } from '@/use-cases/factories/make-pick-suggested-gyms'

function queryValue(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }
  if (Array.isArray(value)) {
    const first = value[0]
    return first === undefined || first === null ? undefined : String(first)
  }
  return String(value)
}

const querySchema = z.object({
  isPrivateClassesAllowed: z.string().transform((s) => s === 'true'),
  latitude: z
    .string()
    .transform((s) => parseFloat(s))
    .refine((n) => !Number.isNaN(n), { message: 'latitude inválida' }),
  longitude: z
    .string()
    .transform((s) => parseFloat(s))
    .refine((n) => !Number.isNaN(n), { message: 'longitude inválida' }),
})

export async function pickSuggestedGyms(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const q = request.query as Record<string, unknown>

  const { latitude, longitude, isPrivateClassesAllowed } = querySchema.parse({
    latitude: queryValue(q.latitude),
    longitude: queryValue(q.longitude),
    isPrivateClassesAllowed: queryValue(q.isPrivateClassesAllowed),
  })

  try {
    await request.jwtVerify()

    const pickSuggestedGymsUseCase = makePickSuggestedGymsUseCase()

    const { gyms } = await pickSuggestedGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
      userId: request.user.sub,
      isPrivateClassesAllowed,
    })

    return reply.status(200).send({ gyms })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }

    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
