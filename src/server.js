import express from 'express'
import 'express-async-errors'

import routes from './routes/index.js'

const app = express()
const PORT = 3330

app.use(routes)

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
