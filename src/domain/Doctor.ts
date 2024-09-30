import { Name, Email, CRM, CPF } from '@/domain'

export type Availability = {
  id?: number
  date: string
  status: string
  timeSlot: {
    id: number
    startTime: string
    endTime: string
  }
}

export type DoctorData = {
  name: string
  email: string
  cpf: string
  crm: string
}

export class Doctor {
  private constructor (
    private readonly name: Name,
    private readonly email: Email,
    private readonly cpf: CPF,
    private readonly crm: CRM
  ) {
    this.name = name
    this.email = email
    this.cpf = cpf
    this.crm = crm
  }

  public static create (userData: DoctorData): Doctor {
    return new Doctor(
      new Name(userData.name),
      new Email(userData.email),
      new CPF(userData.cpf),
      new CRM(userData.crm)
    )
  }

  get Name (): string {
    return this.name.value
  }

  get Email (): string {
    return this.email.value
  }

  get CPF (): string {
    return this.cpf.value
  }

  get CRM (): string {
    return this.crm.value
  }
}
