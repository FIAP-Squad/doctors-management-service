import { prismaClient } from '@/infrastructure'
import { type Doctor, type DoctorData, type Availability } from '@/domain'

export interface ICreateDoctorRepository {
  create: (value: Doctor) => Promise<void>
}

export interface ILoadDoctorRepository {
  load: (query: any) => Promise<DoctorData[]>
}

export interface ICreateAvailabilitiesRepository {
  createAvailabilities: (params: { doctorId: number, availabilities: Array<{ date: string, status: string, timeSlotId: number }> }) => Promise<void>
}

export interface IUpdateAvailabilitiesRepository {
  updateAvailabilities: (params: { doctorId: number, availabilities: Array<{ id: number, status: string }> }) => Promise<void>
}

export interface ILoadAvailabilitiesRepository {
  findAvailabilitiesByDoctorId: (doctorId: number) => Promise<Availability[]>
}

export class DoctorRepository implements
  ICreateDoctorRepository,
  ICreateAvailabilitiesRepository,
  ILoadAvailabilitiesRepository,
  IUpdateAvailabilitiesRepository {
  async findAvailabilitiesByDoctorId (doctorId: number): Promise<Availability[]> {
    return await prismaClient.availability.findMany({
      where: { doctorId: Number(doctorId) },
      select: {
        id: true,
        date: true,
        status: true,
        timeSlot: {
          select: {
            id: true,
            startTime: true,
            endTime: true
          }
        }
      }
    })
  }

  async createAvailabilities ({ doctorId, availabilities }): Promise<void> {
    for (const availability of availabilities) {
      await prismaClient.availability.create({
        data: {
          date: availability.date,
          status: availability.status,
          timeSlotId: availability.timeSlotId,
          doctorId
        }
      })
    }
  }

  async updateAvailabilities ({ doctorId, availabilities }): Promise<void> {
    for (const availability of availabilities) {
      await prismaClient.availability.update({
        where: { id: Number(availability.id), doctorId: Number(doctorId) },
        data: { status: availability.status }
      })
    }
  }

  async create (doctor: Doctor): Promise<void> {
    await prismaClient.doctor.create({
      data: {
        name: doctor.Name,
        email: doctor.Email,
        crm: doctor.CRM,
        cpf: doctor.CPF
      }
    })
  }

  async load (filter: any): Promise<DoctorData[]> {
    return await prismaClient.doctor.findMany({
      where: filter,
      select: {
        id: true,
        email: true,
        name: true,
        cpf: true,
        crm: true
      }
    })
  }
}
