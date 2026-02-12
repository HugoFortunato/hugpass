import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { membership } from './controllers/membership'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/membership', membership)
}
