import Knex from 'knex';
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/knexfile.js`)[env];

export const knex = Knex(config)

export const USER_READY_MESSAGE="¡Sho locoooo!"

export const FILE_ID = 'AgACAgEAAx0Cb-Bn0gADvWUB_jXDK8fIOpNJSdd1u8d5vYlSAALUqzEbiDkQRIHtMPIlOtWBAQADAgADcwADMAQ'