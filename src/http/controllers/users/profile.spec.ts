import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    console.log(response, 'user')

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      user: {
        id: response.body.user.id,
        name: response.body.user.name,
        email: response.body.user.email,
        created_at: response.body.user.created_at,
        password_hash: response.body.user.password_hash,
      },
    })
  })
})
