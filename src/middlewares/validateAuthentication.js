import ClientError from '../utils/errors/ClientError.js'
import authConfig from '../configs/authConfig.js'
import jsonwebtoken from 'jsonwebtoken'

const { verify } = jsonwebtoken
const { secret } = authConfig.jwt

function validateAuthentication(request, response, next) {
  const authenticationHeader = request.headers.authorization

  if (!authenticationHeader) {
    throw new ClientError('Token de autenticação não informado', 401)
  }

  const [, token] = authenticationHeader.split(' ')

  try {
    const { sub: user_id } = verify(token, secret)

    request.user = {
      id: String(user_id)
    }

    return next()
  } catch {
    throw new ClientError('Token de autenticação inválido', 401)
  }
}

export default validateAuthentication
