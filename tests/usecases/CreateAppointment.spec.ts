import { CreateAppointment, type CreateAppointmentParams, type ICreateAppointment } from '@/usecases/CreateAppointment'
import { type IUpdateAvailabilitiesRepository, type ICreateAppointmentRepository, type IEmitterGateway, type IDeleteAppointmentRepository } from '@/infrastructure'
import { type UpdateAvailabilitiesParams } from '@/usecases'

const mockCreateParams = (): CreateAppointmentParams => ({
  doctor: {
    id: 1,
    name: 'any_user',
    email: 'any@mail.com'
  },
  patient: {
    id: 1,
    name: 'any_user'
  },
  availability: {
    id: 2,
    date: '2024-01-01',
    startTime: '10:00',
    endTime: '10:30'
  }
})

const mockCreateRepository = (): ICreateAppointmentRepository => {
  class RepositoryStub implements ICreateAppointmentRepository {
    async createAppointment (params: { patientId: number, availabilityId: number }): Promise<number> {
      return await Promise.resolve(1)
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

const mockDeleteRepository = (): IDeleteAppointmentRepository => {
  class DeleteAppointmentRepositoryStub implements IDeleteAppointmentRepository {
    async deleteAppointment ({ id }): Promise<void> {
      await Promise.resolve()
    }
  }
  return new DeleteAppointmentRepositoryStub()
}

const mockEmitterGateway = (): IEmitterGateway => {
  class EmitterGatewayStub implements IEmitterGateway {
    async publish (params: { queue: string, message: any }): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new EmitterGatewayStub()
}

type SutTypes = {
  sut: ICreateAppointment
  createRepositoryStub: ICreateAppointmentRepository
  updateRepositoryStub: IUpdateAvailabilitiesRepository
  deleteRepositoryStub: IDeleteAppointmentRepository
  emitterGatewayStub: IEmitterGateway
}

const mockSut = (): SutTypes => {
  const createRepositoryStub = mockCreateRepository()
  const updateRepositoryStub = mockUpdateRepository()
  const deleteRepositoryStub = mockDeleteRepository()
  const emitterGatewayStub = mockEmitterGateway()
  const sut = new CreateAppointment(createRepositoryStub, updateRepositoryStub, deleteRepositoryStub, emitterGatewayStub)
  return {
    sut,
    createRepositoryStub,
    updateRepositoryStub,
    deleteRepositoryStub,
    emitterGatewayStub
  }
}

describe('CreateAppointment UseCase', () => {
  test('Should call repository with correct params', async () => {
    const { sut, createRepositoryStub } = mockSut()
    const spy = jest.spyOn(createRepositoryStub, 'createAppointment')
    await sut.execute(mockCreateParams())
    expect(spy).toHaveBeenCalledWith({ patientId: 1, availabilityId: 2 })
  })

  test('Should throw if repository throws', async () => {
    const { sut, createRepositoryStub } = mockSut()
    jest.spyOn(createRepositoryStub, 'createAppointment').mockRejectedValueOnce(new Error('Repository Error'))
    await expect(sut.execute(mockCreateParams())).rejects.toThrow('Repository Error')
  })

  test('Should throw if emitterGateway throws', async () => {
    const { sut, emitterGatewayStub } = mockSut()
    jest.spyOn(emitterGatewayStub, 'publish').mockRejectedValueOnce(new Error('Emitter Error'))
    await expect(sut.execute(mockCreateParams())).rejects.toThrow('Failed to publish appointment event: Emitter Error')
  })

  test('Should call deleteAppointment when emitter fails', async () => {
    const { sut, emitterGatewayStub, deleteRepositoryStub } = mockSut()
    jest.spyOn(emitterGatewayStub, 'publish').mockRejectedValueOnce(new Error('Emitter Error'))
    const deleteSpy = jest.spyOn(deleteRepositoryStub, 'deleteAppointment')
    try {
      await sut.execute(mockCreateParams())
    } catch (error) {
    }
    expect(deleteSpy).toHaveBeenCalledWith({ id: 1 })
  })

  test('Should update availability when emitter fails', async () => {
    const { sut, emitterGatewayStub, updateRepositoryStub } = mockSut()
    jest.spyOn(emitterGatewayStub, 'publish').mockRejectedValueOnce(new Error('Emitter Error'))
    const updateSpy = jest.spyOn(updateRepositoryStub, 'updateAvailabilities')
    try {
      await sut.execute(mockCreateParams())
    } catch (error) {
    }
    expect(updateSpy).toHaveBeenCalledWith({
      doctorId: 1,
      availabilities: [{ status: 'available', id: 2 }]
    })
  })

  test('Should update availability with correct params when appointment is created', async () => {
    const { sut, updateRepositoryStub } = mockSut()
    const updateSpy = jest.spyOn(updateRepositoryStub, 'updateAvailabilities')
    await sut.execute(mockCreateParams())
    expect(updateSpy).toHaveBeenCalledWith({
      doctorId: 1,
      availabilities: [{ status: 'busy', id: 2 }]
    })
  })

  test('Should publish to emitter with correct params', async () => {
    const { sut, emitterGatewayStub } = mockSut()
    const publishSpy = jest.spyOn(emitterGatewayStub, 'publish')
    await sut.execute(mockCreateParams())
    expect(publishSpy).toHaveBeenCalledWith({
      queue: 'appointment-created',
      message: {
        doctor: { id: 1, name: 'any_user', email: 'any@mail.com' },
        patient: { id: 1, name: 'any_user' },
        date: '2024-01-01',
        startTime: '10:00',
        endTime: '10:30'
      }
    })
  })
})
