import { RequiredFieldsValidation, ValidationComposite, type IValidation } from '@/infrastructure'

export const makeSignInValidation = (): IValidation => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password', 'type']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  return new ValidationComposite(validations)
}
