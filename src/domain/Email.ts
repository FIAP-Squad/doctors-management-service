export class Email {
  private readonly email: string

  constructor (email: string) {
    if (!this.validate(email)) throw new Error('InvalidEmailError')
    this.email = email
  }

  private validate (email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public get value (): string {
    return this.email
  }
}
