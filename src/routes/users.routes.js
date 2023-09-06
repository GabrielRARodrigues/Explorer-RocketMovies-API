import { Router } from 'express'
import UsersController from '../controllers/UsersController.js'

const userRoutes = Router()

const usersController = new UsersController()

userRoutes.post('/', usersController.create)
userRoutes.get('/:id', usersController.show)
userRoutes.delete('/:id', usersController.delete)
userRoutes.put('/:id', usersController.update)

export default userRoutes
