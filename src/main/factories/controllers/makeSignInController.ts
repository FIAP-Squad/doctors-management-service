import { type Controller, LoadDoctorController, LogErrorDAO, DoctorRepository } from '@/infrastructure'
import { LogControllerDecorator } from '@/main/decorators'
import { LoadDoctor } from '@/usecases'

export const makeLoadDoctorController = (): Controller => {
  const DAO = new LogErrorDAO()
  const repository = new DoctorRepository()
  const usecase = new LoadDoctor(repository)
  const controller = new LoadDoctorController(usecase)
  return new LogControllerDecorator(controller, DAO)
}
