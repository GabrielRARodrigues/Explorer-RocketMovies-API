import knex from '../database/knex/index.js'
import ClientError from '../utils/errors/ClientError.js'
import DiskStorage from '../providers/DiskStorage.js'

class AvatarController {
  async update(request, response) {
    const user_id = request.user.id
    const avatarImageFilename = request.file.filename

    const diskStorage = new DiskStorage()

    if (!avatarImageFilename) {
      throw new ClientError(
        'Para atualizar o avatar é necessário fornecer um arquivo de imagem'
      )
    }

    const user = await knex('users').where({ id: user_id }).first()

    if (!user) {
      throw new ClientError(
        'Somente usuários autenticados podem atualizar o avatar',
        401
      )
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    const filename = await diskStorage.saveFile(avatarImageFilename)
    user.avatar = filename

    await knex('users').where({ id: user_id }).update(user)

    return response.json(user)
  }
}

export default AvatarController
