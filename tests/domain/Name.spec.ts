import { Name } from '@/domain'

const makeSut = (): Name => {
  return new Name('Valid Name')
}

describe('Name Value Object', () => {
  test('Should return invalid name error if name is empty', () => {
    expect(() => new Name('')).toThrow(new Error('InvalidNameError'))
  })

  test('Should create a valid Name', () => {
    const sut = makeSut()
    expect(sut.value).toBe('Valid Name')
  })

  test('Should return invalid name error if name is too long', () => {
    const longName = 'a'.repeat(101)
    expect(() => new Name(longName)).toThrow(new Error('InvalidNameError'))
  })
})
