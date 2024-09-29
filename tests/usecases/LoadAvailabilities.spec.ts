import { LoadAvailabilities } from '@/usecases'
import { type ILoadAvailabilitiesRepository } from '@/infrastructure'
import { type DoctorAvailability } from '@/domain'

const mockDoctorAvailability = (): DoctorAvailability[] => ([
  {
    id: 1,
    date: new Date('2024-09-30T10:00:00Z'),
    timeSlot: [
      {
        id: 1,
        startTime: new Date('2024-09-30T10:00:00Z'),
        endTime: new Date('2024-09-30T10:30:00Z')
      },
      {
        id: 2,
        startTime: new Date('2024-09-30T10:30:00Z'),
        endTime: new Date('2024-09-30T11:00:00Z')
      }
    ]
  }
])

// Mock do repositório
const mockLoadAvailabilityRepository = (): ILoadAvailabilitiesRepository => {
  class LoadAvailabilitiesRepositoryStub implements ILoadAvailabilitiesRepository {
    async findAvailabilitiesByDoctorId (doctorId: number): Promise<DoctorAvailability[]> {
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
