import { FastifyInstance } from 'fastify'
import { fetchNearbyGyms } from './fetch-nearby-gyms'
import { pickSuggestedGyms } from './pick-suggested-gyms'

import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { createNewGym } from './create-new-gym'
import { search } from './search'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', fetchNearbyGyms)
  app.get('/gyms/suggested', pickSuggestedGyms)
  app.post('/gyms', createNewGym)
}
