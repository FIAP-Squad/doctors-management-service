import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'
import { makeCreateAvailabilitiesValidation } from '@/main/factories/validations'

jest.mock('@/infrastructure/validations/ValidationComposite')

describe('Create Availabilities IValidation Factory', () => {
  test('Should call validation with all validations ', () => {
    makeCreateAvailabilitiesValidation()
    const validations: IValidation[] = []
    for (const field of ['doctorId', 'availabilities']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
