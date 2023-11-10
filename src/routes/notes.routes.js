import { Router } from 'express'
import NotesController from '../controllers/NotesController.js'
import validateAuthentication from '../middlewares/validateAuthentication.js'

const notesRoutes = Router()

const notesController = new NotesController()

notesRoutes.use(validateAuthentication)

notesRoutes.post('/', notesController.create)
notesRoutes.get('/', notesController.index)
notesRoutes.get('/:id', notesController.show)
notesRoutes.delete('/:id', notesController.delete)

export default notesRoutes
