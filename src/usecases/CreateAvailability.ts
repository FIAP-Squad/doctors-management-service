import { type ICreateAvailabilityRepository } from '@/infrastructure'

export type AvailabilityParams = {
  email: string
  date: string
  startTime: string
  endTime: string
}

export interface ICreateAvailability {
  execute: ({ email, date, startTime, endTime }) => Promise<void>
}

export class CreateAvailability implements ICreateAvailability {
  constructor (
    private readonly _repository: ICreateAvailabilityRepository
  ) { }

  async execute (availability: AvailabilityParams): Promise<void> {
    await this._repository.createAvailability(availability)
  }
}
