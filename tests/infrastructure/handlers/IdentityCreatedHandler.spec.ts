import { IdentityCreatedHandler } from '@/infrastructure'
import { type ICreateDoctor } from '@/usecases'

const mockEvent = (): any => (JSON.stringify({
  type: 'DOCTOR',
  email: 'test@example.com',
  password: 'securePassword',
  customAttributes: {
    crm: '123456MG',
    cpf: '12345678901'
  }
}))

const mockCreateDoctor = (): ICreateDoctor => {
  class CreateDoctorStub implements ICreateDoctor {
    async execute (params: any): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new CreateDoctorStub()
}

interface SutTypes {
  sut: IdentityCreatedHandler
  CreateDoctorStub: ICreateDoctor
}

const makeSut = (): SutTypes => {
  const CreateDoctorStub = mockCreateDoctor()
  const sut = new IdentityCreatedHandler(CreateDoctorStub)
  return {
    sut,
    CreateDoctorStub
  }
}

describe('IdentityCreatedHandler', () => {
  test('Should call ICreateDoctor with correct values', async () => {
    const { sut, CreateDoctorStub } = makeSut()
    const event = mockEvent()
    const spy = jest.spyOn(CreateDoctorStub, 'execute')
    await sut.handle(event)
    expect(spy).toHaveBeenCalledWith(JSON.parse(event))
  })

  test('Should throw if ICreateDoctor throws', async () => {
    const { sut, CreateDoctorStub } = makeSut()
    jest.spyOn(CreateDoctorStub, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
    const event = mockEvent()
    await expect(sut.handle(event)).resolves.toBeUndefined()
  })

  test('Should execute successfully when ICreateDoctor completes without error', async () => {
    const { sut } = makeSut()
    const event = mockEvent()
    await expect(sut.handle(event)).resolves.not.toThrow()
  })
})
