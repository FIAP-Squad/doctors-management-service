import { prismaClient } from '@/infrastructure'
import { type Doctor } from '@/domain'

export interface ICreateDoctorRepository {
  create: (value: Doctor) => Promise<void>
}

export class DoctorRepository implements ICreateDoctorRepository {
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
