import { type Response, type Router } from 'express'

export const health = (router: Router): void => {
  router.get('/health', (_, response: Response) => {
    response.status(200).json({ message: 'Healthy' })
  })
}
