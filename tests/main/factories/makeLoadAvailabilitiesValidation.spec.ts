import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'
import { makeLoadAvailabilitiesValidation } from '@/main/factories/validations'

jest.mock('@/infrastructure/validations/ValidationComposite')

describe('Load Availabilities IValidation Factory', () => {
  test('Should call validation with all validations ', () => {
    makeLoadAvailabilitiesValidation()
    const validations: IValidation[] = []
    for (const field of ['doctorId']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
