import { Doctor } from '@/domain'
import {
  type ICreateDoctorRepository,
  type IEmitterGateway
} from '@/infrastructure'

export interface ICreateDoctor {
  execute: (params: any) => Promise<void>
}

export class CreateDoctor implements ICreateDoctor {
  public readonly queue: string = 'doctor-created'
  constructor (
    private readonly _repository: ICreateDoctorRepository,
    private readonly _emitter: IEmitterGateway
  ) { }

  async execute ({ email, name, crm, cpf }): Promise<void> {
    const doctor = Doctor.create({ email, name, crm, cpf })
    await this._repository.create(doctor)
    await this._emitter.publish({
      queue: this.queue,
      message: { email, name, crm, cpf }
    })
  }
}
