import { knex } from "../config"

type HomePlace = {
  id: number
  name: string
}


export const getAllHomePlaces = async():Promise<HomePlace[]>=>{
  const result = await knex.select("*").from('home_places')
  return result
}