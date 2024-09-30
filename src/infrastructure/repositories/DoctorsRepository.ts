import { prismaClient } from '@/infrastructure'
import { type Doctor, type DoctorData, type Availability } from '@/domain'

export interface ICreateDoctorRepository {
  create: (value: Doctor) => Promise<void>
}

export interface ILoadDoctorRepository {
  load: (query: any) => Promise<DoctorData[]>
}

export interface ICreateAvailabilitiesRepository {
  createAvailability: (params: { doctorId: number, availabilities: Array<{ date: string, status: string, timeSlotId: number }> }) => Promise<void>
}

export interface ILoadAvailabilitiesRepository {
  findAvailabilitiesByDoctorId: (doctorId: number) => Promise<Availability[]>
}

export class DoctorRepository implements ICreateDoctorRepository, ICreateAvailabilitiesRepository, ILoadAvailabilitiesRepository {
  async findAvailabilitiesByDoctorId (doctorId: number): Promise<Availability[]> {
    return await prismaClient.availability.findMany({
      where: { doctorId },
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

  async createAvailability ({ doctorId, availabilities }: { doctorId: number, availabilities: Array<{ date: string, status: string, timeSlotId: number }> }): Promise<void> {
    console.log({ doctorId, availabilities })
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

  // async update ({ id, body }: UpdateOrderParamsRepository): Promise<void> {
  //   await prismaClient.order.update({ where: { id }, data: { status: body.status } })
  // }

  // async loadAll (filter: any): Promise<Array<WithId<OrdersDTO>>> {
  //   return await prismaClient.order.findMany({
  //     where: filter,
  //     select: {
  //       id: true,
  //       customer: true,
  //       status: true,
  //       amount: true,
  //       items: {
  //         select: {
  //           totalItems: true,
  //           unitPrice: true,
  //           amount: true,
  //           orderId: true,
  //           productId: true
  //         }
  //       }
  //     }
  //   })
  // }
}
