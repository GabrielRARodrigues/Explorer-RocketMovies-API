import { Router } from 'express'
import AvatarController from '../controllers/AvatarController.js'
import validateAuthentication from '../middlewares/validateAuthentication.js'

import multer from 'multer'
import uploadConfig from '../configs/uploadConfig.js'

const avatarRoutes = Router()
const uploadImage = multer(uploadConfig.MULTER)

const avatarController = new AvatarController()

avatarRoutes.patch(
  '/avatar',
  validateAuthentication,
  uploadImage.single('avatar'),
  avatarController.update
)

export default avatarRoutes
