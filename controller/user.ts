import { knex } from "../config"

export const getAllUsers = async()=>{
  const result = await knex.select("*").from('users')
  return result
}