import { noSQLHelper } from '@/infrastructure'

export interface ILogErrorDAO {
  logError: (stack: string) => Promise<void>
}

export class LogErrorDAO implements ILogErrorDAO {
  async logError (stack: string): Promise<void> {
    const errorCollection = noSQLHelper.getCollection('auth_service_logs')
    const date = new Date().toString()
    process.stdout.write('ERROR:' + stack + 'DATE' + date)
    await errorCollection.insertOne({
      data: stack,
      date
    })
  }
}
