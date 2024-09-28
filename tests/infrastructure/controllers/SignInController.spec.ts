import { SignInController, type IValidation, type IHTTPRequest, Presenter, type AuthenticationResult } from '@/infrastructure'
import { type SignInParams, type ISignIn } from '@/usecases'

const mockAuthenticationResul = (): AuthenticationResult => ({
  AccessToken: 'any_token',
  ExpiresIn: 3600,
  IdToken: 'any_id',
  NewDeviceMetadata: 'any_device',
  RefreshToken: 'any_refresh_token'
})

const mockValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const mockSignIn = (): ISignIn => {
  class SignInStub implements ISignIn {
    async execute (params: SignInParams): Promise<AuthenticationResult> {
      return await Promise.resolve(null)
    }
  }
  return new SignInStub()
}

interface SutTypes {
  sut: SignInController
  validationStub: IValidation
  signInStub: ISignIn
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const signInStub = mockSignIn()
  const sut = new SignInController(validationStub, signInStub)
  return {
    sut,
    validationStub,
    signInStub
  }
}

const mockRequest = (): IHTTPRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('SignInController', () => {
  test('Should return server error if SignIn throws', async () => {
    const { sut, signInStub } = makeSut()
    jest.spyOn(signInStub, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(Presenter.serverError(new Error()))
  })

  test('Should return bad request if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error('Validation error'))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(Presenter.badRequest(new Error('Validation error')))
  })

  test('Should return unauthorized if usecase returns not authorized error', async () => {
    const { sut, signInStub } = makeSut()
    const error = new Error()
    error.name = 'NotAuthorizedException'
    jest.spyOn(signInStub, 'execute').mockReturnValueOnce(Promise.reject(error))
    const request = mockRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(Presenter.unauthorized())
  })

  test('Should return 200 if SignIn succeeds', async () => {
    const { sut, signInStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(signInStub, 'execute').mockReturnValueOnce(Promise.resolve(mockAuthenticationResul()))
    const response = await sut.handle(request)
    expect(response).toEqual(Presenter.ok(mockAuthenticationResul()))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should call SignIn with correct values', async () => {
    const { sut, signInStub } = makeSut()
    const executeSpy = jest.spyOn(signInStub, 'execute')
    const request = mockRequest()
    await sut.handle(request)
    expect(executeSpy).toHaveBeenCalledWith(request.body)
  })
})
