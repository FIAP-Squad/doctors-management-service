import {
  type IUpdateAvailabilitiesRepository,
  type ICreateAppointmentRepository,
  type IDeleteAppointmentRepository,
  type IEmitterGateway

} from '@/infrastructure'

export type CreateAppointmentParams = {
  patient: {
    id: number
    name: string
  }
  doctor: {
    id: number
    name: string
    email: string
  }
  availability: {
    id: number
    startTime: string
    endTime: string
  }
}

export interface ICreateAppointment {
  execute: ({ doctor, patient, availability }: CreateAppointmentParams) => Promise<void>
}

export class CreateAppointment implements ICreateAppointment {
  private readonly _queue: string = 'appointment-created'
  constructor (
    private readonly _createRepository: ICreateAppointmentRepository,
    private readonly _updateRepository: IUpdateAvailabilitiesRepository,
    private readonly _deleteRepository: IDeleteAppointmentRepository,
    private readonly _emitterGateway: IEmitterGateway
  ) { }

  async execute ({ doctor, patient, availability }: CreateAppointmentParams): Promise<void> {
    const id = await this._createRepository.createAppointment({ patientId: patient.id, availabilityId: availability.id })
    await this._updateRepository.updateAvailabilities({ doctorId: doctor.id, availabilities: [{ status: 'busy', id: availability.id }] })
    try {
      await this._emitterGateway.publish({ queue: this._queue, message: { doctor, patient, startTime: availability.startTime, endTime: availability.endTime } })
    } catch (error) {
      await this._deleteRepository.deleteAppointment({ id })
      await this._updateRepository.updateAvailabilities({ doctorId: doctor.id, availabilities: [{ status: 'available', id: availability.id }] })
      throw new Error(`Failed to publish appointment event: ${error.message}`)
    }
  }
}
