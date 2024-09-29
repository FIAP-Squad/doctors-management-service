import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoadDoctorController, makeCreateAvailabilityController, makeLoadAvailabilitiesController } from '@/main/factories/controllers'

export const doctors = (router: Router): void => {
  router.get('/doctors', adaptRoute(makeLoadDoctorController()))
  router.get('/doctors/:id/availability', adaptRoute(makeLoadAvailabilitiesController()))
  router.post('/doctors/availability', adaptRoute(makeCreateAvailabilityController()))
}
