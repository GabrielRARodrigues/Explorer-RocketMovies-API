import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp')
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, 'uploads')

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomUUID().replace(/[-]/g, '')
      const fileName = `${fileHash}-${file.originalname}`

      return callback(null, fileName)
    }
  })
}

export default {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER
}
