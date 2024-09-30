import { CreateAppointment, type CreateAppointmentParams, type ICreateAppointment } from '@/usecases/CreateAppointment'
import { type IUpdateAvailabilitiesRepository, type ICreateAppointmentRepository } from '@/infrastructure'
import { type UpdateAvailabilitiesParams } from '@/usecases'

const mockCreateParams = (): CreateAppointmentParams => ({
  doctorId: 1,
  patientId: 1,
  availabilityId: 2
})

const mockCreateRepository = (): ICreateAppointmentRepository => {
  class RepositoryStub implements ICreateAppointmentRepository {
    async createAppointment (params: CreateAppointmentParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new RepositoryStub()
}

const mockUpdateRepository = (): IUpdateAvailabilitiesRepository => {
  class UpdateAvailabilitiesRepositoryStub implements IUpdateAvailabilitiesRepository {
    async updateAvailabilities (params: UpdateAvailabilitiesParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAvailabilitiesRepositoryStub()
}

type SutTypes = {
  sut: ICreateAppointment
  createRepositoryStub: ICreateAppointmentRepository
  updateRepositoryStub: IUpdateAvailabilitiesRepository
}

const mockSut = (): SutTypes => {
  const createRepositoryStub = mockCreateRepository()
  const updateRepositoryStub = mockUpdateRepository()
  const sut = new CreateAppointment(createRepositoryStub, updateRepositoryStub)
  return {
    sut,
    createRepositoryStub,
    updateRepositoryStub
  }
}

describe('CreateAppointment UseCase', () => {
  test('Should call repository with correct params', async () => {
    const { sut, createRepositoryStub } = mockSut()
    const { doctorId, ...data } = mockCreateParams()
    const spy = jest.spyOn(createRepositoryStub, 'createAppointment')
    await sut.execute(mockCreateParams())
    expect(spy).toHaveBeenCalledWith(data)
  })

  test('Should throw if repository throws', async () => {
    const { sut, createRepositoryStub } = mockSut()
    jest.spyOn(createRepositoryStub, 'createAppointment').mockReturnValueOnce(Promise.reject(new Error('Repository Error')))
    const promise = sut.execute(mockCreateParams())
    await expect(promise).rejects.toThrow(new Error('Repository Error'))
  })
})
