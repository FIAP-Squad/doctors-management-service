export class Name {
  private readonly name: string
  constructor (name: string) {
    if (!this.validate(name)) throw new Error('InvalidNameError')
    this.name = name
  }

  private validate (name: string): boolean {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 100
  }

  public get value (): string {
    return this.name
  }
}
