import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'

export const makeLoadAvailabilitiesValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['doctorId']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}
