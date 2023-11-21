import crypto from 'crypto'

const PRIVATE_KEY = crypto.randomUUID()

export default {
  jwt: {
    secret: process.env.AUTH_SECRET || PRIVATE_KEY,
    expiresIn: '7d'
  }
}
