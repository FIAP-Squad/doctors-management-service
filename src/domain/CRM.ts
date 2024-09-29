export class CRM {
  private readonly crm: string

  constructor (crm: string) {
    if (!this.validate(crm)) throw new Error('InvalidCRMError')
    this.crm = crm
  }

  private validate (crm: string): boolean {
    return crm.length >= 4 && crm.length <= 10
  }

  public get value (): string {
    return this.crm
  }
}
