import app from './config/app'
import configRoutes from './config/routes'

configRoutes(app)
app.listen(5050, () => console.log('Server runing at http://localhost:5050 '))
