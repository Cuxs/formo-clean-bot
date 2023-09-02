import Knex from 'knex';
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/knexfile.js`)[env];

export const knex = Knex(config)

const INTERVAL_TIME = 1000 * 10 //1000 * 60 * 60 * 5