import { Router } from 'express'
import NotesController from '../controllers/NotesController.js'

const notesRoutes = Router()

const notesController = new NotesController()

notesRoutes.get('/', notesController.index)
notesRoutes.get('/:id', notesController.show)
notesRoutes.post('/:user_id', notesController.create)
notesRoutes.delete('/:id', notesController.delete)

export default notesRoutes
