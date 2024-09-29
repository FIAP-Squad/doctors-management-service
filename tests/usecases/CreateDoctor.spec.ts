import { CreateDoctor } from '@/usecases'
import { type ICreateDoctorRepository, type IEmitterGateway } from '@/infrastructure'
import { Doctor } from '@/domain'

const mockDoctorData = (): any => ({
  email: 'doctor.john.doe@example.com',
  name: 'John Doe',
  crm: '123456-SP',
  cpf: '123.456.789-09'
})

const mockCreateDoctorRepository = (): ICreateDoctorRepository => {
  class RepositoryStub implements ICreateDoctorRepository {
    async create (doctor: any): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new RepositoryStub()
}

const mockEmitterGateway = (): IEmitterGateway => {
  class EmitterStub implements IEmitterGateway {
    async publish ({ queue, message }): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new EmitterStub()
}

type SutTypes = {
  sut: CreateDoctor
  repositoryStub: ICreateDoctorRepository
  emitterStub: IEmitterGateway
}

const mockSut = (): SutTypes => {
  const repositoryStub = mockCreateDoctorRepository()
  const emitterStub = mockEmitterGateway()
  const sut = new CreateDoctor(repositoryStub, emitterStub)
  return {
    sut,
    repositoryStub,
    emitterStub
  }
}

describe('Create Doctor Use Case', () => {
  test('Should throw if repository throws', async () => {
    const { sut, repositoryStub } = mockSut()
    jest.spyOn(repositoryStub, 'create').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockDoctorData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call repository with correct doctor entity', async () => {
    const { sut, repositoryStub } = mockSut()
    const spy = jest.spyOn(repositoryStub, 'create')
    await sut.execute(mockDoctorData())
    expect(spy).toHaveBeenCalledWith(
      Doctor.create(mockDoctorData())
    )
  })

  test('Should throw if emitter throws', async () => {
    const { sut, repositoryStub, emitterStub } = mockSut()
    jest.spyOn(repositoryStub, 'create').mockReturnValueOnce(Promise.resolve())
    jest.spyOn(emitterStub, 'publish').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockDoctorData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call emitter with correct values', async () => {
    const { sut, emitterStub } = mockSut()
    const spy = jest.spyOn(emitterStub, 'publish')
    await sut.execute(mockDoctorData())
    expect(spy).toHaveBeenCalledWith({
      queue: 'doctor-created-queue',
      message: { ...mockDoctorData() }
    })
  })

  test('Should complete execution without throwing errors', async () => {
    const { sut } = mockSut()
    const promise = sut.execute(mockDoctorData())
    await expect(promise).resolves.not.toThrow()
  })
})
