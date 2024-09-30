import { LoadAvailabilities } from '@/usecases'
import { type ILoadAvailabilitiesRepository } from '@/infrastructure'
import { type Availability } from '@/domain'

const mockDoctorAvailability = (): Availability[] => ([
  {
    id: 1,
    date: '2024-09-30T00:00:00Z',
    status: 'busy',
    timeSlot: {
      id: 1,
      startTime: '0000-00-00T10:30:00Z',
      endTime: '0000-00-00T10:30:00Z'
    }
  }
])

const mockLoadAvailabilityRepository = (): ILoadAvailabilitiesRepository => {
  class LoadAvailabilitiesRepositoryStub implements ILoadAvailabilitiesRepository {
    async findAvailabilitiesByDoctorId (doctorId: number): Promise<Availability[]> {
      return await Promise.resolve(mockDoctorAvailability())
    }
  }
  return new LoadAvailabilitiesRepositoryStub()
}

type SutTypes = {
  sut: LoadAvailabilities
  repositoryStub: ILoadAvailabilitiesRepository
}

const mockSut = (): SutTypes => {
  const repositoryStub = mockLoadAvailabilityRepository()
  const sut = new LoadAvailabilities(repositoryStub)
  return { sut, repositoryStub }
}

describe('LoadAvailabilities', () => {
  test('Should call repository with correct doctorId', async () => {
    const { sut, repositoryStub } = mockSut()
    const spy = jest.spyOn(repositoryStub, 'findAvailabilitiesByDoctorId')
    const doctorId = 1
    await sut.execute(doctorId)
    expect(spy).toHaveBeenCalledWith(doctorId)
  })

  test('Should return a list of availabilities on success', async () => {
    const { sut } = mockSut()
    const doctorId = 1
    const availabilities = await sut.execute(doctorId)
    expect(availabilities).toEqual(mockDoctorAvailability())
  })

  test('Should throw if repository throws', async () => {
    const { sut, repositoryStub } = mockSut()
    jest.spyOn(repositoryStub, 'findAvailabilitiesByDoctorId').mockRejectedValueOnce(new Error('Repository error'))
    const doctorId = 1
    await expect(sut.execute(doctorId)).rejects.toThrow('Repository error')
  })
})
