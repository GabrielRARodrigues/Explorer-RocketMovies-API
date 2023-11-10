import { Router } from 'express'

import sessionsRoutes from './sessions.routes.js'
import userRoutes from './users.routes.js'
import notesRoutes from './notes.routes.js'
import tagsRoutes from './tags.routes.js'

const routes = Router()
routes.use('/sessions', sessionsRoutes)
routes.use('/users', userRoutes)
routes.use('/notes', notesRoutes)
routes.use('/tags', tagsRoutes)

export default routes
