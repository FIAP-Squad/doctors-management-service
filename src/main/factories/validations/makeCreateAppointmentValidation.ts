import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'

export const makeCreateAppointmentValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['patientId', 'availabilityId']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}
