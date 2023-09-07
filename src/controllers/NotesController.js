import knex from '../database/knex/index.js'
import ClientError from '../utils/errors/ClientError.js'

class NotesController {
  async create(request, response) {
    const { title, description, tags } = request.body
    let { rating } = request.body
    const { user_id } = request.params

    if (!title || !description || !rating || !tags) {
      throw new ClientError('Todos os campos devem ser informados')
    }

    rating = Number(rating)

    if (!rating) {
      throw new ClientError(
        'O valor informado para a nota do filme tem que ser um número'
      )
    }

    if (rating < 1 || rating > 5) {
      throw new ClientError(
        'A avaliação do filme, tem que ser um número entre 1 e 5'
      )
    }

    const [note_id] = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id
    })

    const movieTagsInsert = tags.map(name => {
      return {
        name,
        note_id,
        user_id
      }
    })

    await knex('movie_tags').insert(movieTagsInsert)

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex('movie_notes').where({ id }).first()

    if (!note) {
      throw new ClientError('A nota não foi encontrada')
    }

    const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name')

    return response.json({
      ...note,
      tags
    })
  }

  async delete(request, response) {
    const { id } = request.params

    const note = await knex('movie_notes').where({ id }).first()

    if (!note) {
      throw new ClientError('A nota não foi encontrada')
    }

    await knex('movie_notes').where(note).delete()

    return response.json()
  }
}

export default NotesController
