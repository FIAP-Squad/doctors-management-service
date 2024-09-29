import { type Controller, CreateAvailabilityController, DoctorRepository, LogErrorDAO } from '@/infrastructure'
import { makeCreateAvailabilityValidation } from '@/main/factories/validations'
import { LogControllerDecorator } from '@/main/decorators'
import { CreateAvailability } from '@/usecases'

export const makeCreateAvailabilityController = (): Controller => {
  const DAO = new LogErrorDAO()
  const repository = new DoctorRepository()
  const validation = makeCreateAvailabilityValidation()
  const usecase = new CreateAvailability(repository)
  const controller = new CreateAvailabilityController(validation, usecase)
  return new LogControllerDecorator(controller, DAO)
}
