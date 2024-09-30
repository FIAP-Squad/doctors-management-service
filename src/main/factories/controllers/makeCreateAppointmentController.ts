import { type Controller, CreateAppointmentController, DoctorRepository, LogErrorDAO } from '@/infrastructure'
import { makeCreateAppointmentValidation } from '@/main/factories/validations'
import { LogControllerDecorator } from '@/main/decorators'
import { CreateAppointment } from '@/usecases'

export const makeCreateAppointmentController = (): Controller => {
  const DAO = new LogErrorDAO()
  const repository = new DoctorRepository()
  const validation = makeCreateAppointmentValidation()
  const usecase = new CreateAppointment(repository, repository)
  const controller = new CreateAppointmentController(validation, usecase)
  return new LogControllerDecorator(controller, DAO)
}
