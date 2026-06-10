import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

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
  latitude: z
    .string()
    .transform((s) => parseFloat(s))
    .refine((n) => !Number.isNaN(n), { message: 'latitude inválida' }),
  longitude: z
    .string()
    .transform((s) => parseFloat(s))
    .refine((n) => !Number.isNaN(n), { message: 'longitude inválida' }),
})

export async function fetchNearbyGyms(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const q = request.query as Record<string, unknown>

  const { latitude, longitude } = querySchema.parse({
    latitude: queryValue(q.latitude),
    longitude: queryValue(q.longitude),
  })

  try {
    await request.jwtVerify()

    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(200).send({ gyms })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(400).send({ message: err.message })
    }

    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}
