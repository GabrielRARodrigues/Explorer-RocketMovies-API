import express from 'express'
import 'express-async-errors'

import routes from './routes/index.js'
import ClientError from './utils/errors/ClientError.js'
import runConnection from './database/knex/index.js'
import cors from 'cors'

runConnection.migrate.latest()

const app = express()
const PORT = 3330

app.use(cors())
app.use(express.json())
app.use(routes)

app.use((error, request, response, next) => {
  if (error instanceof ClientError) {
    return response.status(error.statusCode).json({
      status: 'Client error',
      message: error.message
    })
  }

  return response.status(500).json({
    status: 'Internal error',
    message: error.message
  })
})

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
