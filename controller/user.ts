import * as TelegramBotAPI from "node-telegram-bot-api";
const { knex } = require("../config")


export type User = {
  id: number
  name: string
  telegram_userName: string
  telegram_id: number
}

export const getAllUsers = async():Promise<User[]> =>{
  const result = await knex.select("*").from('users')
  return result
}

export const getUserByTelegramUserName = async(id?: number) =>{
  const result = await knex.select("*").from('users').where({telegram_id: id})
  return result
}

export const saveUser = async(from: TelegramBotAPI.User)=>{
const result = await knex('users').insert({
  name: from.first_name,
  telegram_userName: from.username,
  telegram_id: from.id
})
return result
}