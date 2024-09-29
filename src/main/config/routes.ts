import { type Express, Router } from 'express'
import { health, doctors } from '@/main/routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  doctors(router)
  health(router)
}
