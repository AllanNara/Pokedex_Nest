
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongoUri: process.env.MONGO_URI,
    port: +process.env.PORT,
    defaultLimit: +process.env.DEFAULT_LIMIT
})