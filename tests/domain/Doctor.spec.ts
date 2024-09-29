import { Doctor } from '@/domain'

const makeSut = (): Doctor => {
  const validDoctorData = {
    name: 'Valid Name',
    email: 'valid@example.com',
    cpf: '123.456.789-09', // CPF válido
    crm: '123456'
  }
  return Doctor.create(validDoctorData)
}

describe('Doctor Entity', () => {
  test('Should throw error if Name is invalid', () => {
    const invalidDoctorData = {
      name: '',
      email: 'valid@example.com',
      cpf: '123.456.789-09',
      crm: '123456'
    }
    expect(() => Doctor.create(invalidDoctorData)).toThrow(new Error('InvalidNameError'))
  })

  test('Should throw error if Email is invalid', () => {
    const invalidDoctorData = {
      name: 'Valid Name',
      email: 'invalid-email',
      cpf: '123.456.789-09',
      crm: '123456'
    }
    expect(() => Doctor.create(invalidDoctorData)).toThrow(new Error('InvalidEmailError'))
  })

  test('Should throw error if CPF is invalid', () => {
    const invalidDoctorData = {
      name: 'Valid Name',
      email: 'valid@example.com',
      cpf: '111.111.111-11',
      crm: '123456'
    }
    expect(() => Doctor.create(invalidDoctorData)).toThrow(new Error('InvalidCPFError'))
  })

  test('Should throw error if CRM is invalid', () => {
    const invalidDoctorData = {
      name: 'Valid Name',
      email: 'valid@example.com',
      cpf: '123.456.789-09',
      crm: '123'
    }
    expect(() => Doctor.create(invalidDoctorData)).toThrow(new Error('InvalidCRMError'))
  })

  test('Should create a valid Doctor entity', () => {
    const doctor = makeSut()
    expect(doctor.Name).toBe('Valid Name')
    expect(doctor.Email).toBe('valid@example.com')
    expect(doctor.CPF).toBe('12345678909')
    expect(doctor.CRM).toBe('123456')
  })
})
