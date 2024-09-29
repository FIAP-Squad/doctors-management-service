import { LoadDoctorController } from '@/infrastructure'
import { type ILoadDoctor } from '@/usecases'
import { type IHTTPRequest, Presenter } from '@/infrastructure'

const mockRequest = (): IHTTPRequest => ({
  query: { name: 'John Doe' }
})

const mockDoctorList = (): any[] => ([
  {
    email: 'doctor.john.doe@example.com',
    name: 'John Doe',
    crm: '123456-SP',
    cpf: '123.456.789-09'
  }
])

const mockLoadDoctor = (): ILoadDoctor => {
  class LoadDoctorStub implements ILoadDoctor {
    async execute (query: any): Promise<any[]> {
      return await Promise.resolve(mockDoctorList())
    }
  }
  return new LoadDoctorStub()
}

type SutTypes = {
  sut: LoadDoctorController
  loadDoctorStub: ILoadDoctor
}

const mockSut = (): SutTypes => {
  const loadDoctorStub = mockLoadDoctor()
  const sut = new LoadDoctorController(loadDoctorStub)
  return {
    sut,
    loadDoctorStub
  }
}

describe('LoadDoctor Controller', () => {
  test('Should call usecase with correct query', async () => {
    const { sut, loadDoctorStub } = mockSut()
    const spy = jest.spyOn(loadDoctorStub, 'execute')
    await sut.handle(mockRequest())
    expect(spy).toHaveBeenCalledWith(mockRequest().query)
  })

  test('Should return 200 and a list of doctors on success', async () => {
    const { sut } = mockSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.ok(mockDoctorList()))
  })

  test('Should return 500 if usecase throws', async () => {
    const { sut, loadDoctorStub } = mockSut()
    jest.spyOn(loadDoctorStub, 'execute').mockReturnValueOnce(Promise.reject(new Error('Server Error')))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(Presenter.serverError(new Error('Server Error')))
  })
})
