import { type Express, Router } from 'express'
import { health, auth } from '@/main/routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  auth(router)
  health(router)
}
