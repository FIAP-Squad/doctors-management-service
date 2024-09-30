import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import {
  makeLoadDoctorController,
  makeCreateAvailabilitiesController,
  makeLoadAvailabilitiesController,
  makeUpdateAvailabilitiesController,
  makeCreateAppointmentController
} from '@/main/factories/controllers'

export const doctors = (router: Router): void => {
  router.get('/doctors', adaptRoute(makeLoadDoctorController()))
  router.get('/doctors/:doctorId/availability', adaptRoute(makeLoadAvailabilitiesController()))
  router.post('/doctors/availability/batch', adaptRoute(makeCreateAvailabilitiesController()))
  router.patch('/doctors/:doctorId/availability/batch', adaptRoute(makeUpdateAvailabilitiesController()))
  router.post('/doctors/appointment', adaptRoute(makeCreateAppointmentController()))
}
