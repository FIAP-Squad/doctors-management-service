export class CPF {
  private readonly cpf: string

  constructor (cpf: string) {
    const cleanedCPF = this.clean(cpf)
    if (!this.validate(cleanedCPF)) {
      throw new Error('InvalidCPFError')
    }
    this.cpf = cleanedCPF
  }

  private clean (cpf: string): string {
    return cpf.replace(/\D/g, '')
  }

  private validate (cpf: string): boolean {
    if (!this.isValidFormat(cpf)) return false
    return this.isValidCPF(cpf)
  }

  private isValidFormat (cpf: string): boolean {
    const cpfRegex = /^\d{11}$/
    return cpfRegex.test(cpf) && !this.isRepeatedSequence(cpf)
  }

  private isRepeatedSequence (cpf: string): boolean {
    const repeatedSequences = [
      '00000000000', '11111111111', '22222222222', '33333333333',
      '44444444444', '55555555555', '66666666666', '77777777777',
      '88888888888', '99999999999'
    ]
    return repeatedSequences.includes(cpf)
  }

  private isValidCPF (cpf: string): boolean {
    const numbers = cpf.split('').map(digit => parseInt(digit, 10))
    const calculateVerifier = (start: number): number => {
      let sum = 0
      for (let i = 0; i < start; i++) { sum += numbers[i] * ((start + 1) - i) }
      const result = sum % 11
      return result < 2 ? 0 : 11 - result
    }

    const firstVerifier = calculateVerifier(9)
    const secondVerifier = calculateVerifier(10)
    return firstVerifier === numbers[9] && secondVerifier === numbers[10]
  }

  public getFormatted (): string {
    return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  public get value (): string {
    return this.cpf
  }
}
