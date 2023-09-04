import { Router } from 'express'

const userRoutes = Router()

userRoutes.get('/', (req, res) => {
  res.send(`<p> Você está acessando a rota de usuario </p>`)
})


export default userRoutes;