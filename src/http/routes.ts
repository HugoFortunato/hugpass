import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { membership } from './controllers/membership'
import { authenticate } from './controllers/authenticate'
import { fetchNearbyGyms } from './controllers/fetch-nearby-gyms'
import { verifyJwt } from './middlewares/verify-jwt'
import { profile } from './controllers/profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/membership', membership)
  app.post('/sessions', authenticate)
  app.get('/gyms/nearby', fetchNearbyGyms)
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
