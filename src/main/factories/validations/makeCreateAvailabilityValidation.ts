import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'

export const makeCreateAvailabilityValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['email', 'date', 'startTime', 'endTime']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}
