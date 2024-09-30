import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'
import { makeCreateAvailabilityValidation } from '@/main/factories/validations'

jest.mock('@/infrastructure/validations/ValidationComposite')

describe('Create Availability IValidation Factory', () => {
  test('Should call validation with all validations ', () => {
    makeCreateAvailabilityValidation()
    const validations: IValidation[] = []
    for (const field of ['doctorId', 'availabilities']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
