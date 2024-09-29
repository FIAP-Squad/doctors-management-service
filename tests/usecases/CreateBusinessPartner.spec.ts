import { type EventMapParams, type IEmitterGateway, type IEventMapDAO, type ISignUpGateway, type CognitoParams, type IUpdateEntityPasswordGateway, type IDeleteGateway } from '@/infrastructure'
import { type AdminCreateUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import { CreateBusinessPartner } from '@/usecases'

const mockIdentity = (): any => ({
  User: {
    Attributes: 'any_user'
  }
})

const mockEventParams = (): any => ({
  userPoolId: 'any_user_pool_Id',
  queue: 'any_queue'
})

const mockUseCaseParams = (): any => ({
  type: 'DOCTOR',
  email: 'any_email@mail.com',
  password: 'any_password',
  customAttributes: {
    cpf: 'any_cpf',
    crm: 'any_crm'
  }
})

const mockGatewayParams = (): any => ({
  userPoolId: 'any_user_pool_Id',
  username: mockUseCaseParams().email,
  email: mockUseCaseParams().email,
  password: mockUseCaseParams().password,
  customAttributes: mockUseCaseParams().customAttributes
})

const mockQueueEvent = (): any => ({
  queue: mockEventParams().queue,
  message: {
    type: mockUseCaseParams().type,
    properties: {
      email: mockUseCaseParams().email,
      customAttributes: {
        cpf: mockUseCaseParams().customAttributes.cpf,
        crm: mockUseCaseParams().customAttributes.crm
      }
    }
  }
})

const mockDAO = (): IEventMapDAO => {
  class DAOStub implements IEventMapDAO {
    async load (type: string): Promise<EventMapParams> {
      return await Promise.resolve(null)
    }
  }
  return new DAOStub()
}

const mockSignUpGateway = (): ISignUpGateway => {
  class GatewayStub implements ISignUpGateway {
    async signup (user: CognitoParams): Promise<AdminCreateUserCommandOutput> {
      return await Promise.resolve(null)
    }
  }
  return new GatewayStub()
}

const mockUpdateGateway = (): IUpdateEntityPasswordGateway => {
  class UpdateGatewayStub implements IUpdateEntityPasswordGateway {
    async updatePassword ({ userPoolId, username, password }): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new UpdateGatewayStub()
}

const mockDeleteGateway = (): IDeleteGateway => {
  class DeleteGatewayStub implements IDeleteGateway {
    async delete ({ userPoolId, username }): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DeleteGatewayStub()
}

const mockEmitter = (): IEmitterGateway => {
  class EmitterStub implements IEmitterGateway {
    async publish ({ queue, message }): Promise<void> {
      await Promise.resolve(null)
    }
  }
  return new EmitterStub()
}

type SutTypes = {
  sut: CreateBusinessPartner
  DAOStub: IEventMapDAO
  signupGatewayStub: ISignUpGateway
  updateGatewayStub: IUpdateEntityPasswordGateway
  deleteGatewayStub: IDeleteGateway
  emitterStub: IEmitterGateway
}

const mockSut = (): SutTypes => {
  const DAOStub = mockDAO()
  const signupGatewayStub = mockSignUpGateway()
  const updateGatewayStub = mockUpdateGateway()
  const deleteGatewayStub = mockDeleteGateway()
  const emitterStub = mockEmitter()
  const sut = new CreateBusinessPartner(DAOStub, signupGatewayStub, updateGatewayStub, deleteGatewayStub, emitterStub)
  return {
    sut,
    DAOStub,
    signupGatewayStub,
    updateGatewayStub,
    deleteGatewayStub,
    emitterStub
  }
}

describe('Create Business Partner', () => {
  test('Show throw if DAO throw ', async () => {
    const { sut, DAOStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockUseCaseParams())
    await expect(promise).rejects.toThrow()
  })

  test('Show call DAO with correct values', async () => {
    const { sut, DAOStub, signupGatewayStub } = mockSut()
    const { type } = mockUseCaseParams()
    const spy = jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(signupGatewayStub, 'signup').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    await sut.execute(mockUseCaseParams())
    expect(spy).toHaveBeenCalledWith(type)
  })

  test('Show throw if Gateway throw ', async () => {
    const { sut, signupGatewayStub, DAOStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(signupGatewayStub, 'signup').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockUseCaseParams())
    await expect(promise).rejects.toThrow()
  })

  test('Show call Gateway with correct values', async () => {
    const { sut, signupGatewayStub, DAOStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    const spy = jest.spyOn(signupGatewayStub, 'signup').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    await sut.execute(mockUseCaseParams())
    expect(spy).toHaveBeenCalledWith(mockGatewayParams())
  })

  test('Show throw if Emitter throw ', async () => {
    const { sut, signupGatewayStub, DAOStub, emitterStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(signupGatewayStub, 'signup').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    jest.spyOn(emitterStub, 'publish').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockUseCaseParams())
    await expect(promise).rejects.toThrow()
  })

  test('Show call Emitter with correct values', async () => {
    const { sut, signupGatewayStub, DAOStub, emitterStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(signupGatewayStub, 'signup').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    const spy = jest.spyOn(emitterStub, 'publish')
    await sut.execute(mockUseCaseParams())
    expect(spy).toHaveBeenCalledWith(mockQueueEvent())
  })

  test('Should update user with password if signup is successful', async () => {
    const { sut, signupGatewayStub, DAOStub, updateGatewayStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(signupGatewayStub, 'signup').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    const updateSpy = jest.spyOn(updateGatewayStub, 'updatePassword')
    await sut.execute(mockUseCaseParams())
    expect(updateSpy).toHaveBeenCalledWith({
      userPoolId: mockEventParams().userPoolId,
      username: mockUseCaseParams().email,
      password: mockUseCaseParams().password
    })
  })

  test('Should delete user if there is an error during password update', async () => {
    const { sut, signupGatewayStub, DAOStub, updateGatewayStub, deleteGatewayStub } = mockSut()
    jest.spyOn(DAOStub, 'load').mockReturnValueOnce(Promise.resolve(mockEventParams()))
    jest.spyOn(signupGatewayStub, 'signup').mockReturnValueOnce(Promise.resolve(mockIdentity()))
    jest.spyOn(updateGatewayStub, 'updatePassword').mockReturnValueOnce(Promise.reject(new Error('Password update failed')))
    const deleteSpy = jest.spyOn(deleteGatewayStub, 'delete')
    await sut.execute(mockUseCaseParams())
    expect(deleteSpy).toHaveBeenCalledWith({
      userPoolId: mockEventParams().userPoolId,
      username: mockUseCaseParams().email
    })
  })
})
