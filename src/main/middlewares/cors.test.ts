import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('should allow api access', async () => {
    app.get('/test-cors', (req, res) => {
      res.json(req.body)
    })
    await request(app).get('/test-cors').expect('access-control-allow-origin', '*').expect('access-control-allow-methods', '*').expect('access-control-allow-headers', '*')
  })
})
