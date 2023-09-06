import { Router } from 'express'

import userRoutes from './users.routes.js'
import notesRoutes from './notes.routes.js'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/notes', notesRoutes)

export default routes
