import { knex } from "../config"
const { v4: uuidv4 } = require('uuid');

export const insertAssignment = async (row:Record<string,string>)=>{
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

export const getAssignments = async()=>{
  const result = await knex('users_home_places')
  console.log(result)
}
