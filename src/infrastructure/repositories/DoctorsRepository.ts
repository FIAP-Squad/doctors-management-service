import { prismaClient } from '@/infrastructure'
import { type Doctor, type DoctorData, type DoctorAvailability } from '@/domain'

export interface ICreateDoctorRepository {
  create: (value: Doctor) => Promise<void>
}

export interface ILoadDoctorRepository {
  load: (query: any) => Promise<DoctorData[]>
}

export interface ICreateAvailabilityRepository {
  createAvailability: ({ email, date, startTime, endTime }) => Promise<void>
}

export interface ILoadAvailabilitiesRepository {
  findAvailabilitiesByDoctorId: (doctorId: number) => Promise<DoctorAvailability[]>
}

export class DoctorRepository implements ICreateDoctorRepository, ICreateAvailabilityRepository, ILoadAvailabilitiesRepository {
  async findAvailabilitiesByDoctorId (doctorId: number): Promise<DoctorAvailability[]> {
    return await prismaClient.availability.findMany({
      where: { doctorId },
      select: {
        id: true,
        date: true,
        timeSlot: {
          where: { status: 'available' },
          select: {
            id: true,
            status: true,
            startTime: true,
            endTime: true
          }
        }
      }
    })
  }

  async createAvailability ({ email, date, startTime, endTime, status }): Promise<void> {
    await prismaClient.$transaction(async prisma => {
      const doctor = await prisma.doctor.findUnique({
        where: { email }
      })

      await prisma.availability.create({
        data: {
          date,
          doctorId: doctor.id,
          timeSlot: {
            create: {
              status,
              startTime,
              endTime
            }
          }
        }
      })
    })
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
