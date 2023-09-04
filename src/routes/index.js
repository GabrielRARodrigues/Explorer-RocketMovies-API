import { Router } from 'express'

import userRoutes from './users.routes.js'

const routes = Router()

routes.use('/users', userRoutes)

export default routes
