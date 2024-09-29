import { type ILoadAvailabilities } from '@/usecases'
import { LoadAvailabilitiesController, type IHTTPRequest, Presenter } from '@/infrastructure'

const mockRequest = (): IHTTPRequest => ({
  query: { doctorId: '1' }
})

const mockAvailabilitiesList = (): any[] => ([
  {
    date: '2024-09-30T10:00:00Z',
    timeslots: [
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' }
    ]
  }
])

const mockLoadAvailabilities = (): ILoadAvailabilities => {
  class LoadAvailabilitiesStub implements ILoadAvailabilities {
    async execute (query: any): Promise<any[]> {
      return await Promise.resolve(mockAvailabilitiesList())
    }
  }
  return new LoadAvailabilitiesStub()
}

type SutTypes = {
  sut: LoadAvailabilitiesController
  loadAvailabilitiesStub: ILoadAvailabilities
}

const mockSut = (): SutTypes => {
  const loadAvailabilitiesStub = mockLoadAvailabilities()
  const sut = new LoadAvailabilitiesController(loadAvailabilitiesStub)
  return {
    sut,
    loadAvailabilitiesStub
  }
}

describe('LoadAvailabilitiesController Controller', () => {
  test('Should call usecase with correct query', async () => {
    const { sut, loadAvailabilitiesStub } = mockSut()
    const spy = jest.spyOn(loadAvailabilitiesStub, 'execute')
    await sut.handle(mockRequest())
    expect(spy).toHaveBeenCalledWith(mockRequest().query)
  })

  test('Should return 200 and a list of availabilities on success', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.ok(mockAvailabilitiesList()))
  })

  test('Should return 500 if usecase throws', async () => {
    const { sut, loadAvailabilitiesStub } = mockSut()
    jest.spyOn(loadAvailabilitiesStub, 'execute').mockReturnValueOnce(Promise.reject(new Error('Server Error')))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.serverError(new Error('Server Error')))
  })
})
