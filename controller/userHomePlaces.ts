const { knex } = require("../config")
const { v4: uuidv4 } = require('uuid');

type UserHomePlace = {
  id: number
  user_id: number,
  home_place_id: number
  created_at: string
  updated_at: string
  uuid: string
}

export const insertAssignment = async (row:Record<string,number>)=>{
const rowsArray = Object.entries(row)
const uuid = uuidv4()
const bulkRows = rowsArray.map((result)=>{
  return {
    user_id: result[0],
    home_place_id: result [1],
    created_at: new Date(),
    updated_at: new Date(),
    uuid
  }
})
  await knex.batchInsert('users_home_places', bulkRows, 4)
}

export const getAssignments = async(): Promise<UserHomePlace[]>=>{
  const result = await knex('users_home_places')
  return result
}
export const getLastAssignments = async(): Promise<UserHomePlace[]>=>{
  const result = await knex('users_home_places').orderBy('id', 'desc').limit(3)
  return result
}