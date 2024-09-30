import { UpdateAvailabilities, type UpdateAvailabilitiesParams, type IUpdateAvailabilities } from '@/usecases/UpdateAvailabilities'
import { type IUpdateAvailabilitiesRepository } from '@/infrastructure'

const mockRepository = (): IUpdateAvailabilitiesRepository => {
  class UpdateAvailabilitiesRepositoryStub implements IUpdateAvailabilitiesRepository {
    async updateAvailabilities (params: UpdateAvailabilitiesParams): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAvailabilitiesRepositoryStub()
}

type SutTypes = {
  sut: IUpdateAvailabilities
  repositoryStub: IUpdateAvailabilitiesRepository
}

const mockSut = (): SutTypes => {
  const repositoryStub = mockRepository()
  const sut = new UpdateAvailabilities(repositoryStub)
  return {
    sut,
    repositoryStub
  }
}

describe('UpdateAvailabilities UseCase', () => {
  const mockParams = {
    doctorId: 1,
    availabilities: [
      { id: 1, status: 'available' },
      { id: 2, status: 'unavailable' }
    ]
  }

  test('Should call repository with correct params', async () => {
    const { sut, repositoryStub } = mockSut()
    const spy = jest.spyOn(repositoryStub, 'updateAvailabilities')
    await sut.execute(mockParams)
    expect(spy).toHaveBeenCalledWith(mockParams)
  })

  test('Should throw if repository throws', async () => {
    const { sut, repositoryStub } = mockSut()
    jest.spyOn(repositoryStub, 'updateAvailabilities').mockReturnValueOnce(Promise.reject(new Error('Repository Error')))
    const promise = sut.execute(mockParams)
    await expect(promise).rejects.toThrow(new Error('Repository Error'))
  })
})
