import { knex } from "../config"

type User = {
  id: number
  name: string
}

export const getAllUsers = async():Promise<User[]> =>{
  const result = await knex.select("*").from('users')
  return result
}