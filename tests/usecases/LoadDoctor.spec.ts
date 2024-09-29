import { LoadDoctor } from '@/usecases'
import { type ILoadDoctorRepository } from '@/infrastructure'
import { type DoctorData } from '@/domain'

const mockDoctorList = (): DoctorData[] => ([
  {
    email: 'doctor.john.doe@example.com',
    name: 'John Doe',
    crm: '123456-SP',
    cpf: '123.456.789-09'
  },
  {
    email: 'doctor.jane.doe@example.com',
    name: 'Jane Doe',
    crm: '654321-RJ',
    cpf: '987.654.321-00'
  }
])

const mockLoadDoctorRepository = (): ILoadDoctorRepository => {
  class LoadDoctorRepositoryStub implements ILoadDoctorRepository {
    async load (query: any): Promise<DoctorData[]> {
      return await Promise.resolve(mockDoctorList())
    }
  }
  return new LoadDoctorRepositoryStub()
}

type SutTypes = {
  sut: LoadDoctor
  repositoryStub: ILoadDoctorRepository
}

const mockSut = (): SutTypes => {
  const repositoryStub = mockLoadDoctorRepository()
  const sut = new LoadDoctor(repositoryStub)
  return {
    sut,
    repositoryStub
  }
}

describe('LoadDoctor Use Case', () => {
  test('Should call repository with correct query', async () => {
    const { sut, repositoryStub } = mockSut()
    const spy = jest.spyOn(repositoryStub, 'load')
    const query = { name: 'John Doe' }
    await sut.execute(query)
    expect(spy).toHaveBeenCalledWith(query)
  })

  test('Should return a list of doctors on success', async () => {
    const { sut } = mockSut()
    const query = { name: 'John Doe' }
    const doctors = await sut.execute(query)
    expect(doctors).toEqual(mockDoctorList())
  })

  test('Should throw if repository throws', async () => {
    const { sut, repositoryStub } = mockSut()
    jest.spyOn(repositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error('Repository Error')))
    const query = { name: 'John Doe' }
    const promise = sut.execute(query)
    await expect(promise).rejects.toThrow(new Error('Repository Error'))
  })
})
