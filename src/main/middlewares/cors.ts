import {
  type Request,
  type Response,
  type NextFunction
} from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', 'https://mydomain.com.br')
  res.set('access-control-allow-methods', 'GET, PUT, POST, PATCH, OPTIONS')
  res.set('access-control-allow-headers', 'Authorization')
  next()
}
