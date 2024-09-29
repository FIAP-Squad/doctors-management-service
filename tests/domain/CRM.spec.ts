import { CRM } from '@/domain'

const makeSut = (): CRM => {
  return new CRM('123456')
}

describe('CRM Value Object', () => {
  test('Should return invalid CRM error if CRM is too short', () => {
    expect(() => new CRM('123')).toThrow(new Error('InvalidCRMError'))
  })

  test('Should create a valid CRM', () => {
    const sut = makeSut()
    expect(sut.value).toBe('123456')
  })

  test('Should return invalid CRM error if CRM is too long', () => {
    expect(() => new CRM('12345678901')).toThrow(new Error('InvalidCRMError'))
  })
})
