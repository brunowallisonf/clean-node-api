import request from 'supertest'
import app from '../config/app'

describe('', () => {
  test('should allow api access', async () => {
    await request(app).post('/api/signup').send({ name: 'bruno', email: 'valid_email', password: '123456', confirmPassword: '123456' }).expect(200)
  })
})
