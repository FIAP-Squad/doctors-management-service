import { type DoctorAvailability } from '@/domain'
import { type ILoadAvailabilitiesRepository } from '@/infrastructure'

export interface ILoadAvailabilities {
  execute: (doctorId: number) => Promise<DoctorAvailability[]>
}

export class LoadAvailabilities implements ILoadAvailabilities {
  constructor (private readonly _repository: ILoadAvailabilitiesRepository) { }
  async execute (doctorId: number): Promise<DoctorAvailability[]> {
    return await this._repository.findAvailabilitiesByDoctorId(doctorId)
  }
}
