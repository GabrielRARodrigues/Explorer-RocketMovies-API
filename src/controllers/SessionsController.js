import knex from '../database/knex/index.js'
import ClientError from '../utils/errors/ClientError.js'
import bcryptjs from 'bcryptjs'
import authConfig from '../configs/authConfig.js'
import jsonwebtoken from 'jsonwebtoken'

const { compare } = bcryptjs
const { sign } = jsonwebtoken

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    if (!email || !password) {
      throw new ClientError('O e-mail e a senha devem ser informados', 401)
    }

    const user = await knex('users').where({ email }).first()

    if (!user) {
      throw new ClientError(
        'Usuário não encontrado, e-mail e/ou senha incorreta',
        401
      )
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new ClientError('E-mai e/ou senha incorreta', 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json({ user, token })
  }
}

export default SessionsController
