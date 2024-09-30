import { type IUpdateAvailabilitiesRepository } from '@/infrastructure'

export type UpdateAvailabilitiesParams = {
  doctorId: number
  availabilities: Array<{
    id: number
    status: string
  }>
}

export interface IUpdateAvailabilities {
  execute: (params: UpdateAvailabilitiesParams) => Promise<void>
}

export class UpdateAvailabilities implements IUpdateAvailabilities {
  constructor (
    private readonly _repository: IUpdateAvailabilitiesRepository
  ) { }

  async execute (params: UpdateAvailabilitiesParams): Promise<void> {
    await this._repository.updateAvailabilities(params)
  }
}
