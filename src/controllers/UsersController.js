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
    const { id } = request.user
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
    const { id } = request.user
    const userSearched = await knex('users').where({ id }).first()

    if (!userSearched) {
      throw new ClientError('O usuário não foi encontrado')
    }

    await knex('users').where({ id }).delete()

    return response.json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const { id } = request.user

    const userSearched = await knex('users').where({ id }).first()

    if (!userSearched) {
      throw new ClientError('O usuário não foi encontrado')
    }

    if (email) {
      const checkUserEmailAlreadyExists = await knex('users')
        .where({ email })
        .first()
      if (
        checkUserEmailAlreadyExists &&
        checkUserEmailAlreadyExists.id !== userSearched.id
      ) {
        throw new ClientError('Este e-mail já está em uso.')
      }
    }

    userSearched.name = name ? name : userSearched.name
    userSearched.email = email ? email : userSearched.email

    if (password && !old_password) {
      throw new ClientError(
        'Você precisa informar a senha antiga para definir a nova senha'
      )
    }

    if (password && old_password) {
      const checkOldPassword = await bcryptjs.compare(
        old_password,
        userSearched.password
      )
      if (!checkOldPassword) {
        throw new ClientError('A senha antiga não confere')
      }

      userSearched.password = await bcryptjs.hash(password, 8)
    }

    await knex('users').where({ id }).update({
      name: userSearched.name,
      email: userSearched.email,
      password: userSearched.password,
      updated_at: knex.fn.now()
    })

    return response.status(200).json()
  }
}

export default UsersController
