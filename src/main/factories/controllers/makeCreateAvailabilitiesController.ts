import { type Controller, CreateAvailabilitiesController, DoctorRepository, LogErrorDAO } from '@/infrastructure'
import { makeCreateAvailabilitiesValidation } from '@/main/factories/validations'
import { LogControllerDecorator } from '@/main/decorators'
import { CreateAvailabilities } from '@/usecases'

export const makeCreateAvailabilitiesController = (): Controller => {
  const DAO = new LogErrorDAO()
  const repository = new DoctorRepository()
  const validation = makeCreateAvailabilitiesValidation()
  const usecase = new CreateAvailabilities(repository)
  const controller = new CreateAvailabilitiesController(validation, usecase)
  return new LogControllerDecorator(controller, DAO)
}
