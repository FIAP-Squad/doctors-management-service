import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoadDoctorController, makeCreateAvailabilityController } from '@/main/factories/controllers'

export const doctors = (router: Router): void => {
  router.get('/doctors', adaptRoute(makeLoadDoctorController()))
  router.post('/doctors/availability', adaptRoute(makeCreateAvailabilityController()))
}
