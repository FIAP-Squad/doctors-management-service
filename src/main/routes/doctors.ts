import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoadDoctorController } from '@/main/factories/controllers'

export const doctors = (router: Router): void => {
  router.get('/doctors', adaptRoute(makeLoadDoctorController()))
}
