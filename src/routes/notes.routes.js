import { Router } from 'express'
import NotesController from '../controllers/NotesController.js'

const notesRoutes = Router()

const notesController = new NotesController()

export default notesRoutes
