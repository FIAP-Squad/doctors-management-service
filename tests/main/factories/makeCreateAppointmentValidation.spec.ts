import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'
import { makeCreateAppointmentValidation } from '@/main/factories/validations'

jest.mock('@/infrastructure/validations/ValidationComposite')

describe('Create Appointment IValidation Factory', () => {
  test('Should call validation with all validations ', () => {
    makeCreateAppointmentValidation()
    const validations: IValidation[] = []
    for (const field of ['doctor', 'patient', 'availability']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
