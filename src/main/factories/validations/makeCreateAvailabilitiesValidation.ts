import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'

export const makeCreateAvailabilitiesValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['doctorId', 'availabilities']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}
