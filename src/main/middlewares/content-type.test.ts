import request from 'supertest'
import app from '../config/app'

describe('CORS Middleware', () => {
  test('should return content-type as json', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send('')
    })
    await request(app).get('/test-content-type').expect('content-type', /json/i)
  })
  test('should return content-type as xml', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app).get('/test-content-type-xml').expect('content-type', /xml/i)
  })
})
