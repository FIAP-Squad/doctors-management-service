import { SignIn, type SignInParams } from '@/usecases'
import { type IEventMapDAO, type ISignInGateway, type AuthenticationResult } from '@/infrastructure'

const mockAuthenticationResult = (): AuthenticationResult => ({
  AccessToken: 'any_token',
  ExpiresIn: 3600,
  IdToken: 'any_id',
  NewDeviceMetadata: 'any_device',
  RefreshToken: 'any_refresh_token'
})

const mockDAO = (): IEventMapDAO => {
  class EventMapDAOStub implements IEventMapDAO {
    async load (type: string): Promise<any> {
      return await Promise.resolve({ clientId: 'any_client_id' })
    }
  }
  return new EventMapDAOStub()
}

const mockGateway = (): ISignInGateway => {
  class SignInGatewayStub implements ISignInGateway {
    async signin ({ clientId, username, password }: { clientId: any, username: string, password: string }): Promise<AuthenticationResult> {
      return await Promise.resolve(mockAuthenticationResult())
    }
  }
  return new SignInGatewayStub()
}

interface SutTypes {
  sut: SignIn
  daoStub: IEventMapDAO
  gatewayStub: ISignInGateway
}

const makeSut = (): SutTypes => {
  const daoStub = mockDAO()
  const gatewayStub = mockGateway()
  const sut = new SignIn(daoStub, gatewayStub)
  return {
    sut,
    daoStub,
    gatewayStub
  }
}

const mockSignInParams = (): SignInParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
  type: 'any_type'
})

describe('SignIn Use Case', () => {
  test('Should return AuthenticationResult on success', async () => {
    const { sut } = makeSut()
    const params = mockSignInParams()
    const result = await sut.execute(params)
    expect(result).toEqual(mockAuthenticationResult())
  })

  test('Should call DAO load with correct type', async () => {
    const { sut, daoStub } = makeSut()
    const loadSpy = jest.spyOn(daoStub, 'load')
    const params = mockSignInParams()
    await sut.execute(params)
    expect(loadSpy).toHaveBeenCalledWith('any_type')
  })

  test('Should call Gateway signin with correct values', async () => {
    const { sut, gatewayStub } = makeSut()
    const signinSpy = jest.spyOn(gatewayStub, 'signin')
    const params = mockSignInParams()
    await sut.execute(params)
    expect(signinSpy).toHaveBeenCalledWith({
      clientId: 'any_client_id',
      username: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return null if DAO returns null', async () => {
    const { sut, daoStub } = makeSut()
    jest.spyOn(daoStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const params = mockSignInParams()
    const result = await sut.execute(params)
    expect(result).toBeNull()
  })

  test('Should throw if Gateway throws', async () => {
    const { sut, gatewayStub } = makeSut()
    jest.spyOn(gatewayStub, 'signin').mockImplementationOnce(() => {
      throw new Error()
    })
    const params = mockSignInParams()
    const promise = sut.execute(params)
    await expect(promise).rejects.toThrow()
  })
})
