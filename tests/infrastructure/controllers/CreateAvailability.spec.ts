import { CreateAvailabilityController, Presenter, type IHTTPRequest, type IValidation } from '@/infrastructure'
import { type ICreateAvailability } from '@/usecases'

const mockRequest = (): IHTTPRequest => ({
  body: {
    email: 'doctor.john.doe@example.com',
    date: 1728518400000,
    startTime: 28800000,
    endTime: 43200000
  }
})

const mockValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const mockCreateAvailability = (): ICreateAvailability => {
  class CreateAvailabilityStub implements ICreateAvailability {
    async execute (data: any): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new CreateAvailabilityStub()
}

type SutTypes = {
  sut: CreateAvailabilityController
  validationStub: IValidation
  createAvailabilityStub: ICreateAvailability
}

const mockSut = (): SutTypes => {
  const validationStub = mockValidation()
  const createAvailabilityStub = mockCreateAvailability()
  const sut = new CreateAvailabilityController(validationStub, createAvailabilityStub)
  return {
    sut,
    validationStub,
    createAvailabilityStub
  }
}

describe('CreateAvailability Controller', () => {
  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = mockSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('Validation Error'))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.badRequest(new Error('Validation Error')))
  })

  test('Should call validation with correct body', async () => {
    const { sut, validationStub } = mockSut()
    const spy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith(request.body)
  })

  test('Should call usecase with correct data', async () => {
    const { sut, createAvailabilityStub } = mockSut()
    const spy = jest.spyOn(createAvailabilityStub, 'execute')
    const request = mockRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith({
      email: request.body.email,
      date: request.body.date,
      startTime: request.body.startTime,
      endTime: request.body.endTime
    })
  })

  test('Should return 201 on success', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.created())
  })

  test('Should return 500 if usecase throws', async () => {
    const { sut, createAvailabilityStub } = mockSut()
    jest.spyOn(createAvailabilityStub, 'execute').mockReturnValueOnce(Promise.reject(new Error('Server Error')))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.serverError(new Error('Server Error')))
  })
})
