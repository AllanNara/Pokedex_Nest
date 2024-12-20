import * as Joi from 'joi';

export const JoiValitacionSchema = Joi.object({
    MONGO_URI: Joi.required(),
    DB_NAME: Joi.string().default('pokedex'),
    PORT: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number().default(6)
})