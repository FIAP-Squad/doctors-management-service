import { type Controller, LoadAvailabilitiesController, LogErrorDAO, DoctorRepository } from '@/infrastructure'
import { makeLoadAvailabilitiesValidation } from '@/main/factories/validations'
import { LogControllerDecorator } from '@/main/decorators'
import { LoadAvailabilities } from '@/usecases'

export const makeLoadAvailabilitiesController = (): Controller => {
  const DAO = new LogErrorDAO()
  const repository = new DoctorRepository()
  const validation = makeLoadAvailabilitiesValidation()
  const usecase = new LoadAvailabilities(repository)
  const controller = new LoadAvailabilitiesController(validation, usecase)
  return new LogControllerDecorator(controller, DAO)
}
