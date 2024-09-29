import 'module-alias/register'
import { noSQLHelper, prismaClient } from '@/infrastructure'
import env from '@/main/config/env'
import { brokerClient } from '@/main/adapters'
import brokerSetup from '@/main/config/listeners'

async function startServer (): Promise<void> {
  try {
    await brokerClient.connect()
    await noSQLHelper.connect(env.MONGODB.URL)
    await prismaClient.$connect()
    const { setupApp } = await import('./config/app')
    const app = setupApp()
    await brokerSetup(brokerClient)
    await brokerClient.run()
    app.listen(env.PORT, () => process.stdout.write(`Server running at ${env.PORT}\n`))
  } catch (error) {
    console.error('Error starting the server:', error)
    process.exit(1)
  }
}

void startServer()
