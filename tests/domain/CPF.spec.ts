import { CPF } from '@/domain'

const makeSut = (): CPF => {
  return new CPF('123.456.789-09')
}

describe('CPF Value Object', () => {
  test('Should return invalid CPF error if CPF is invalid', () => {
    expect(() => new CPF('123.456.789-00')).toThrow(new Error('InvalidCPFError'))
  })

  test('Should create a valid CPF', () => {
    const sut = makeSut()
    expect(sut.value).toBe('12345678909')
  })

  test('Should return formatted CPF', () => {
    const sut = makeSut()
    expect(sut.getFormatted()).toBe('123.456.789-09')
  })

  test('Should return invalid CPF error if CPF is a repeated sequence', () => {
    expect(() => new CPF('111.111.111-11')).toThrow(new Error('InvalidCPFError'))
  })
})
