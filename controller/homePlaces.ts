import { knex } from "../config"

export const getAllHomePlaces = async()=>{
  const result = await knex.select("*").from('home_places')
  return result
}