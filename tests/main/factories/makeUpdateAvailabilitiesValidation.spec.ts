import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'
import { makeUpdateAvailabilitiesValidation } from '@/main/factories/validations'

jest.mock('@/infrastructure/validations/ValidationComposite')

describe('Update Availabilities IValidation Factory', () => {
  test('Should call validation with all validations ', () => {
    makeUpdateAvailabilitiesValidation()
    const validations: IValidation[] = []
    for (const field of ['doctorId', 'availabilities']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
