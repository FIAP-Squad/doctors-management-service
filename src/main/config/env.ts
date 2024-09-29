export default {
  PORT: process.env.PORT,
  RABBITMQ: {
    PROTOCOL: process.env.RABBITMQ_PROTOCOL,
    HOST_NAME: process.env.RABBITMQ_HOST_NAME,
    PORT: process.env.RABBITMQ_PORT,
    USERNAME: process.env.RABBITMQ_USERNAME,
    PASSWORD: process.env.RABBITMQ_PASSWORD
  },
  MYSQL: {
    URL: process.env.MYSQL_URL
  },
  MONGODB: {
    URL: process.env.MONGODB_URL,
    DATABASE: process.env.MONGODB_DATABASE
  },
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
  }
}
