import { EventMapDAO, prismaClient } from '@/infrastructure'

describe('EventMapDAO', () => {
  const makeSut = (): EventMapDAO => {
    return new EventMapDAO()
  }
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('should call prismaClient with correct type', async () => {
    const sut = makeSut()
    const type = 'DOCTOR'
    const findFirstSpy = jest.spyOn(prismaClient.identityProperties, 'findFirst').mockResolvedValueOnce({
      id: 'any_id',
      businessPartnerType: 'DOCTOR',
      clientId: 'any_client_id',
      userPoolId: 'any_user_pool_id',
      queue: 'any_queue'
    })
    await sut.load(type)
    expect(findFirstSpy).toHaveBeenCalledWith({
      where: { businessPartnerType: type },
      select: { userPoolId: true, queue: true, clientId: true }
    })
  })
  test('should return null if no record is found', async () => {
    const sut = makeSut()
    jest.spyOn(prismaClient.identityProperties, 'findFirst').mockResolvedValueOnce(null)
    const result = await sut.load('UNKNOWN')
    expect(result).toBeNull()
  })
  test('should throw if prismaClient throws', async () => {
    const sut = makeSut()
    jest.spyOn(prismaClient.identityProperties, 'findFirst').mockRejectedValueOnce(new Error('Database error'))
    const promise = sut.load('DOCTOR')
    await expect(promise).rejects.toThrow('Database error')
  })
})
