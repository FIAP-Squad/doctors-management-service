import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'
import { makeSignInValidation } from '@/main/factories/validations'

jest.mock('@/infrastructure/validations/ValidationComposite')

describe('Add Order IValidation Factory', () => {
  test('Should call validation with all validations ', () => {
    makeSignInValidation()
    const validations: IValidation[] = []
    for (const field of ['email', 'password', 'type']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
