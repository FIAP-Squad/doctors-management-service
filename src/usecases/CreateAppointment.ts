import { type IUpdateAvailabilitiesRepository, type ICreateAppointmentRepository } from '@/infrastructure'

export type CreateAppointmentParams = {
  patientId: number
  doctorId: number
  availabilityId: number
}

export interface ICreateAppointment {
  execute: ({ doctorId, patientId, availabilityId }: CreateAppointmentParams) => Promise<void>
}

export class CreateAppointment implements ICreateAppointment {
  constructor (
    private readonly _createRepository: ICreateAppointmentRepository,
    private readonly _updateRepository: IUpdateAvailabilitiesRepository
  ) { }

  async execute ({ doctorId, patientId, availabilityId }: CreateAppointmentParams): Promise<void> {
    await this._createRepository.createAppointment({ patientId, availabilityId })
    await this._updateRepository.updateAvailabilities({ doctorId, availabilities: [{ status: 'busy', id: availabilityId }] })
  }
}
