import { Router } from 'express'
import UsersController from '../controllers/UsersController.js'
import validateAuthentication from '../middlewares/validateAuthentication.js'

const userRoutes = Router()

const usersController = new UsersController()

userRoutes.post('/', usersController.create)
userRoutes.delete('/', validateAuthentication, usersController.delete)
userRoutes.put('/', validateAuthentication, usersController.update)
userRoutes.get('/', validateAuthentication, usersController.show)

export default userRoutes
