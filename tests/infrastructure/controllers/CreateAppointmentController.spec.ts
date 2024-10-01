import { CreateAppointmentController, Presenter, type IHTTPRequest, type IValidation } from '@/infrastructure'
import { type ICreateAppointment } from '@/usecases'

const mockRequest = (): IHTTPRequest => ({
  body: {
    doctor: {
      id: 1,
      name: 'any_patient',
      email: 'any@mail.com'
    },
    patient: {
      id: 1,
      name: 'any_patient'
    },
    availability: {
      id: 1,
      startTime: '09h00',
      endTime: '09h03'
    }
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

const mockCreateAppointment = (): ICreateAppointment => {
  class CreateAppointmentStub implements ICreateAppointment {
    async execute (data: any): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new CreateAppointmentStub()
}

type SutTypes = {
  sut: CreateAppointmentController
  validationStub: IValidation
  createAppointmentStub: ICreateAppointment
}

const mockSut = (): SutTypes => {
  const validationStub = mockValidation()
  const createAppointmentStub = mockCreateAppointment()
  const sut = new CreateAppointmentController(validationStub, createAppointmentStub)
  return {
    sut,
    validationStub,
    createAppointmentStub
  }
}

describe('CreateAppointment Controller', () => {
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
    const { sut, createAppointmentStub } = mockSut()
    const spy = jest.spyOn(createAppointmentStub, 'execute')
    const request = mockRequest()
    await sut.handle(request)
    expect(spy).toHaveBeenCalledWith({
      doctor: request.body.doctor,
      patient: request.body.patient,
      availability: request.body.availability
    })
  })

  test('Should return 201 on success', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.created())
  })

  test('Should return 500 if usecase throws', async () => {
    const { sut, createAppointmentStub } = mockSut()
    jest.spyOn(createAppointmentStub, 'execute').mockReturnValueOnce(Promise.reject(new Error('Server Error')))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.serverError(new Error('Server Error')))
  })
})
