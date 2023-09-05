const { knex } = require("../config")

type HomePlace = {
  id: number
  name: string
}


export const getAllHomePlaces = async():Promise<HomePlace[]>=>{
  const result = await knex.select("*").from('home_places')
  return result
}
export const getHomePlaceById = async(id: number)=>{
  const result = await knex.select('name').from('home_places').where({id})
  return result[0]
}