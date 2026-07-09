import { FastifyInstance } from 'fastify'
import { register } from './register'
import { membership } from './membership'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { getActiveMembership } from './get-active-membership'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/membership', membership)
  app.post('/sessions', authenticate)
  app.get('/active-membership', getActiveMembership)
  app.patch('/token/refresh', refresh)

  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
