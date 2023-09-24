import knex from '../database/knex/index.js'
import ClientError from '../utils/errors/ClientError.js'

class TagsController {
  async index(request, response) {
    const { user_id } = request.params

    const user = await knex('users').where({ id: user_id }).first()

    if (!user) {
      throw new ClientError('Não existe um usuário com o id informado')
    }

    const tags = await knex('movie_tags').where({ user_id })

    return response.json(tags)
  }
}

export default TagsController
