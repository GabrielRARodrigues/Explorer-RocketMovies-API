import crypto from 'crypto'

const PRIVATE_KEY = crypto.randomUUID()

export default {
  jwt: {
    secret: PRIVATE_KEY,
    expiresIn: '7d'
  }
}
