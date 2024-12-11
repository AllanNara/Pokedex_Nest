
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    dbName: process.env.DB_NAME || 'pokedex',
    mongoUri: process.env.MONGO_URI,
    port: +process.env.PORT,
    defaultLimit: +process.env.DEFAULT_LIMIT
})