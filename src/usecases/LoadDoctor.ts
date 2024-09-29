import { type DoctorData } from '@/domain'
import { type ILoadDoctorRepository } from '@/infrastructure'

export interface ILoadDoctor {
  execute: (query: any) => Promise<DoctorData[]>
}

export class LoadDoctor implements ILoadDoctor {
  constructor (private readonly _repository: ILoadDoctorRepository) { }
  async execute (query: any): Promise<DoctorData[]> {
    return await this._repository.load(query)
  }
}
