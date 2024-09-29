import { IdentityCreatedHandler, EmitterGateway, DoctorRepository, type Handler } from '@/infrastructure'
import { CreateDoctor } from '@/usecases'

export const makeIdentityCreatedHandler = (): Handler => {
  const repository = new DoctorRepository()
  const emitter = new EmitterGateway()
  const usecase = new CreateDoctor(repository, emitter)
  return new IdentityCreatedHandler(usecase)
}
