import { MissingParam, type IValidation } from '@/infrastructure'

export class RequiredFieldsValidation implements IValidation {
  constructor (private readonly fieldName: string) { }
  validate (input: any): Error {
    if (!input[this.fieldName]) return new MissingParam(this.fieldName)
  }
}
