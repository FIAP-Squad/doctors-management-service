import { type Express } from 'express'
import {
  bodyParser,
  cors,
  contentType,
  security
} from '@/main/middlewares'

export default (app: Express): void => {
  app.disable('x-powered-by')
  app.use(security)
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
