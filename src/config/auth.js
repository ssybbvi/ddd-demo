const authConfig = {
  secret: process.env.XALD_MANAGEMENT_APP_SECRET,
  tokenExpiryTime: 300, // seconds => 5 minutes
  redisServerPort: process.env.XALD_MANAGEMENT_REDIS_PORT || 6379,
  redisServerURL: process.env.XALD_MANAGEMENT_REDIS_URL,
  redisConnectionString: process.env.REDIS_URL,
  redisPassword: process.env.XALD_MANAGEMENT_REDIS_PASSWORD,
  mongoDatabaseUrl: process.env.XALD_MANAGEMENT_MONGO_DATABASE_URL,
  mongoDatabaseName: process.env.XALD_MANAGEMENT_MONGO_DATABASE_NAME
}

export {
  authConfig
}