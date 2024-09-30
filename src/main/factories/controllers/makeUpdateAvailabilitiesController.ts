import { type Controller, UpdateAvailabilitiesController, DoctorRepository, LogErrorDAO } from '@/infrastructure'
import { makeUpdateAvailabilitiesValidation } from '@/main/factories/validations'
import { LogControllerDecorator } from '@/main/decorators'
import { UpdateAvailabilities } from '@/usecases'

export const makeUpdateAvailabilitiesController = (): Controller => {
  const DAO = new LogErrorDAO()
  const repository = new DoctorRepository()
  const validation = makeUpdateAvailabilitiesValidation()
  const usecase = new UpdateAvailabilities(repository)
  const controller = new UpdateAvailabilitiesController(validation, usecase)
  return new LogControllerDecorator(controller, DAO)
}
