import { UpdateAvailabilitiesController } from '@/infrastructure/controllers/UpdateAvailabilitiesController'
import { type IHTTPRequest, Presenter, type IValidation } from '@/infrastructure'
import { type IUpdateAvailabilities } from '@/usecases'

// Mock para a request
const mockRequest = (): IHTTPRequest => ({
  params: {
    doctorId: 1
  },
  body: {
    availabilities: [
      {
        id: 1,
        status: 'available'
      },
      {
        id: 2,
        status: 'unavailable'
      }
    ]
  }
})

// Mock para o serviço de validação
const mockValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

// Mock para o usecase
const mockUpdateAvailabilities = (): IUpdateAvailabilities => {
  class UpdateAvailabilitiesStub implements IUpdateAvailabilities {
    async execute (data: any): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new UpdateAvailabilitiesStub()
}

// Helper para criar as instâncias do SUT
type SutTypes = {
  sut: UpdateAvailabilitiesController
  validationStub: IValidation
  updateAvailabilitiesStub: IUpdateAvailabilities
}

const mockSut = (): SutTypes => {
  const validationStub = mockValidation()
  const updateAvailabilitiesStub = mockUpdateAvailabilities()
  const sut = new UpdateAvailabilitiesController(validationStub, updateAvailabilitiesStub)
  return {
    sut,
    validationStub,
    updateAvailabilitiesStub
  }
}

// Testes
describe('UpdateAvailabilities Controller', () => {
  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = mockSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('Validation Error'))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.badRequest(new Error('Validation Error')))
  })

  test('Should call validation with correct params and body', async () => {
    const { sut, validationStub } = mockSut()
    const spy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith({
      doctorId: request.params.doctorId,
      availabilities: request.body.availabilities
    })
  })

  test('Should call usecase with correct data', async () => {
    const { sut, updateAvailabilitiesStub } = mockSut()
    const spy = jest.spyOn(updateAvailabilitiesStub, 'execute')
    const request = mockRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith({
      doctorId: request.params.doctorId,
      availabilities: request.body.availabilities
    })
  })

  test('Should return 201 on success', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.created())
  })

  test('Should return 500 if usecase throws', async () => {
    const { sut, updateAvailabilitiesStub } = mockSut()
    jest.spyOn(updateAvailabilitiesStub, 'execute').mockReturnValueOnce(Promise.reject(new Error('Server Error')))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.serverError(new Error('Server Error')))
  })
})
