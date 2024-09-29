import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeSignInController } from '@/main/factories/controllers'

export const auth = (router: Router): void => {
  router.post('/auth/signin', adaptRoute(makeSignInController()))
}
