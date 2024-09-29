import { type DoctorAvailability } from '@/domain'
import { type ILoadAvailabilityRepository } from '@/infrastructure'

export interface ILoadAvailabilities {
  execute: (doctorId: number) => Promise<DoctorAvailability[]>
}

export class LoadAvailabilities implements ILoadAvailabilities {
  constructor (private readonly _repository: ILoadAvailabilityRepository) { }
  async execute (doctorId: number): Promise<DoctorAvailability[]> {
    return await this._repository.findAvailabilitiesByDoctorId(doctorId)
  }
}
