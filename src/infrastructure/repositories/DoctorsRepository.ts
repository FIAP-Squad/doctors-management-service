import { prismaClient } from '@/infrastructure'
import { type DoctorData, type Doctor } from '@/domain'

export interface ICreateDoctorRepository {
  create: (value: Doctor) => Promise<void>
}

export interface ILoadDoctorRepository {
  load: (query: any) => Promise<DoctorData[]>
}

export interface ICreateAvailabilityRepository {
  createAvailability: ({ email, date, startTime, endTime }) => Promise<void>
}

export class DoctorRepository implements ICreateDoctorRepository, ICreateAvailabilityRepository {
  async createAvailability ({ email, date, startTime, endTime }): Promise<void> {
    await prismaClient.$transaction(async prisma => {
      const doctor = await prisma.doctor.findUnique({
        where: { email }
      })

      await prisma.availability.create({
        data: {
          date,
          doctorId: doctor.id,
          TimeSlot: {
            create: {
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
