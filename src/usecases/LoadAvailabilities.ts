import { type Availability } from '@/domain'
import { type ILoadAvailabilitiesRepository } from '@/infrastructure'

export interface ILoadAvailabilities {
  execute: (doctorId: number) => Promise<Availability[]>
}

export class LoadAvailabilities implements ILoadAvailabilities {
  constructor (private readonly _repository: ILoadAvailabilitiesRepository) { }
  async execute (doctorId: number): Promise<Availability[]> {
    return await this._repository.findAvailabilitiesByDoctorId(doctorId)
  }
}
