import { Email } from '@/domain'

const makeSut = (): Email => {
  return new Email('valid@example.com')
}

describe('Email Value Object', () => {
  test('Should return invalid email error if email is empty', () => {
    expect(() => new Email('')).toThrow(new Error('InvalidEmailError'))
  })

  test('Should create a valid Email', () => {
    const sut = makeSut()
    expect(sut.value).toBe('valid@example.com')
  })

  test('Should return invalid email error if email is invalid', () => {
    expect(() => new Email('invalid-email')).toThrow(new Error('InvalidEmailError'))
  })
})
