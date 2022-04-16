import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('should return parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.json(req.body)
    })
    await request(app).post('/test-body-parser').send({ name: 'bruno' }).expect({ name: 'bruno' })
  })
})
