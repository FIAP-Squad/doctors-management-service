import { type DoctorAvailability } from '@/domain'
import { type ILoadAvailabilities } from '@/usecases'
import { LoadAvailabilitiesController, type IValidation, Presenter, type IHTTPRequest, type IHTTPResponse } from '@/infrastructure'

const mockDoctorAvailability = (): DoctorAvailability[] => ([
  {
    id: 1,
    date: new Date('2024-09-30T10:00:00Z'),
    timeSlot: [
      {
        id: 1,
        startTime: new Date('2024-09-30T10:00:00Z'),
        endTime: new Date('2024-09-30T10:30:00Z')
      }
    ]
  }
])

const mockValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const mockLoadAvailabilities = (): ILoadAvailabilities => {
  class LoadAvailabilitiesStub implements ILoadAvailabilities {
    async execute (doctorId: number): Promise<DoctorAvailability[]> {
      return await Promise.resolve(mockDoctorAvailability())
    }
  }
  return new LoadAvailabilitiesStub()
}

type SutTypes = {
  sut: LoadAvailabilitiesController
  validationStub: IValidation
  loadAvailabilitiesStub: ILoadAvailabilities
}

const mockSut = (): SutTypes => {
  const validationStub = mockValidation()
  const loadAvailabilitiesStub = mockLoadAvailabilities()
  const sut = new LoadAvailabilitiesController(validationStub, loadAvailabilitiesStub)
  return { sut, validationStub, loadAvailabilitiesStub }
}

describe('LoadAvailabilitiesController', () => {
  const mockRequest = (): IHTTPRequest => ({
    params: { doctor: 1 }
  })

  test('Should call validation with correct params', async () => {
    const { sut, validationStub } = mockSut()
    const spy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith(request.params)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = mockSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('Validation Error'))
    const request = mockRequest()
    const response: IHTTPResponse = await sut.handle(request)
    expect(response).toEqual(Presenter.badRequest(new Error('Validation Error')))
  })

  test('Should call usecase with correct doctorId', async () => {
    const { sut, loadAvailabilitiesStub } = mockSut()
    const spy = jest.spyOn(loadAvailabilitiesStub, 'execute')
    const request = mockRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith(request.params.doctor)
  })

  test('Should return 200 and a list of availabilities on success', async () => {
    const { sut } = mockSut()
    const request = mockRequest()
    const response: IHTTPResponse = await sut.handle(request)
    expect(response).toEqual(Presenter.ok(mockDoctorAvailability()))
  })

  test('Should return 500 if usecase throws', async () => {
    const { sut, loadAvailabilitiesStub } = mockSut()
    jest.spyOn(loadAvailabilitiesStub, 'execute').mockRejectedValueOnce(new Error('Server Error'))
    const request = mockRequest()
    const response: IHTTPResponse = await sut.handle(request)
    expect(response).toEqual(Presenter.serverError(new Error('Server Error')))
  })
})
