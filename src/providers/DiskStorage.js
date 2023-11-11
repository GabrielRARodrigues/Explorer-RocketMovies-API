import fs from 'fs'
import path from 'path'
import uploadConfig from '../configs/uploadConfig.js'

const { TMP_FOLDER, UPLOADS_FOLDER } = uploadConfig

class DiskStorage {
  async saveFile(filename) {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, filename),
      path.resolve(UPLOADS_FOLDER, filename)
    )

    return filename
  }

  async deleteFile(filename) {
    const filePath = path.resolve(UPLOADS_FOLDER, filename)

    try {
      await fs.promises.stat(filePath)
    } catch (e) {
      return {
        status: 'error',
        message: e.message
      }
    }

    await fs.promises.unlink(filePath)
  }
}

export default DiskStorage
