import bcryptjs from 'bcryptjs'
import knex from '../database/knex/index.js'
import ClientError from '../utils/errors/ClientError.js'
class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    if (!name || !email || !password) {
      throw new ClientError(
        'A informações de nome, email e senha, precisam ser obrigatoriamente informadas'
      )
    }

    const checkUserEmailAlreadyExists = await knex('users')
      .where({ email })
      .first()

    if (checkUserEmailAlreadyExists) {
      throw new ClientError('Este email já está em uso.')
    }

    const hashedPassword = await bcryptjs.hash(password, 8)

    await knex('users').insert({
      name,
      email,
      password: hashedPassword
    })

    return response.status(201).json()
  }

  async show(request, response) {
    const { id } = request.params

    const userSearched = await knex('users').where({ id }).first()

    if (!userSearched) {
      throw new ClientError('O usuário não foi encontrado')
    }

    const { name, email, avatar, created_at, updated_at } = userSearched

    return response.json({
      name,
      email,
      avatar,
      created_at: new Date(created_at),
      updated_at: new Date(updated_at)
    })
  }

  async delete(request, response) {
    const { id } = request.params

    const userSearched = await knex('users').where({ id }).first()

    if (!userSearched) {
      throw new ClientError('O usuário não foi encontrado')
    }

    await knex('users').where({ id }).delete()

    return response.json()
  }
}

export default UsersController
