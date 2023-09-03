import Knex from 'knex';
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/knexfile.js`)[env];

export const knex = Knex(config)

export const USER_READY_MESSAGE="¡Sho locoooo!"