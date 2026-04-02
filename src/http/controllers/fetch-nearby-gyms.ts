import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

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
  const raw = request.query as Record<string, unknown>
  const parsed = querySchema.safeParse({
    latitude: queryValue(raw.latitude),
    longitude: queryValue(raw.longitude),
  })

  if (!parsed.success) {
    return reply.status(400).send({
      message:
        'Informe latitude e longitude na query (?latitude=&longitude=). Ex.: GET /gyms/nearby?latitude=-23.5614&longitude=-46.656',
      issues: parsed.error.flatten(),
    })
  }

  const { latitude, longitude } = parsed.data

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
