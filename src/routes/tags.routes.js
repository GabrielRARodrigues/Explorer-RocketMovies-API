import { Router } from 'express'
import TagsController from '../controllers/TagsController.js'
import validateAuthentication from '../middlewares/validateAuthentication.js'

const tagsRoutes = Router()

const tagsController = new TagsController()

tagsRoutes.get('/', validateAuthentication, tagsController.index)

export default tagsRoutes
