import { type ICreateAvailabilitiesRepository } from '@/infrastructure'

export type CreateAvailabilitiesParams = {
  doctorId: number
  availabilities: Array<{
    date: string
    status: string
    timeSlotId: number
  }>
}

export interface ICreateAvailabilities {
  execute: ({ doctorId, availabilities }: CreateAvailabilitiesParams) => Promise<void>
}

export class CreateAvailabilities implements ICreateAvailabilities {
  constructor (
    private readonly _repository: ICreateAvailabilitiesRepository
  ) { }

  async execute ({ doctorId, availabilities }: CreateAvailabilitiesParams): Promise<void> {
    await this._repository.createAvailabilities({ doctorId, availabilities })
  }
}
