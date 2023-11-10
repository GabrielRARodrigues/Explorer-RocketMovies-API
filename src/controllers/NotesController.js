import knex from '../database/knex/index.js'
import ClientError from '../utils/errors/ClientError.js'

class NotesController {
  async create(request, response) {
    const { title, description, tags } = request.body
    let { rating } = request.body
    const user_id = request.user.id

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

  async index(request, response) {
    const { title, tags } = request.query
    const user_id = request.user.id

    const user = await knex('users').where({ id: user_id }).first()

    if (!user) {
      throw new ClientError('O usuário não foi encontrado')
    }

    let notes = await knex('movie_notes').where({ user_id }).orderBy('title')
    let userTags = await knex('movie_tags').where({ user_id }).orderBy('name')

    if (title && tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      if (!filterTags.length > 1) {
        throw new ClientError('Pelo menos uma tag precisa ser informada')
      }

      notes = await knex('movie_tags')
        .select([
          'movie_notes.id',
          'movie_notes.title',
          'movie_notes.description',
          'movie_notes.rating',
          'movie_notes.user_id'
        ])
        .where('movie_notes.user_id', user_id)
        .whereLike('movie_notes.title', `%${title}%`)
        .whereIn('name', filterTags)
        .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
        .groupBy('movie_notes.id')
        .orderBy('movie_notes.title')
    } else if (title) {
      notes = await knex('movie_notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .groupBy('title')
        .orderBy('title')
    } else if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      if (!filterTags.length > 1) {
        throw new ClientError('Pelo menos uma tag precisa ser informada')
      }

      notes = await knex('movie_tags')
        .select([
          'movie_notes.id',
          'movie_notes.title',
          'movie_notes.description',
          'movie_notes.rating',
          'movie_notes.user_id'
        ])
        .where('movie_notes.user_id', user_id)
        .whereIn('name', filterTags)
        .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
        .groupBy('notes.id')
        .orderBy('movie_notes.title')
    }

    const notesWithTags = notes.map(note => {
      const notesTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...note,
        tags: notesTags
      }
    })

    return response.json(notesWithTags)
  }
}

export default NotesController
