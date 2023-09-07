const { UserHomePlace } = require("./controller/userHomePlaces")

const { getAllUsers } = require('./controller/user')
const { isEqual } = require('lodash')
const { getAllHomePlaces } = require('./controller/homePlaces')
const { getLastAssignments, insertAssignment } = require('./controller/userHomePlaces')
const TelegramBot = require('node-telegram-bot-api')
const { USER_READY_MESSAGE } = require('./config')

const {Message} = TelegramBot


type AssignmentShuffle = {
  names: Record<string, string>
  ids: Record<string, number>
}

async function shuffle() {
  const users = await getAllUsers()
  const places = await getAllHomePlaces()

  const availablePlaces = [...places]

  return users.reduce((prev: AssignmentShuffle, curr: any) => {
    const maxValue = availablePlaces.length
    const placeRandomIndex = Math.floor(Math.random() * maxValue)
    prev.names[curr.telegram_userName] = availablePlaces[placeRandomIndex].name
    prev.ids[curr.id] = availablePlaces[placeRandomIndex].id
    availablePlaces.splice(placeRandomIndex, 1)
    return prev
  }, { names: {}, ids: {} })
}

export async function getChores() {
  const lastAssignments = await getLastAssignments()
  const lastAssignmentsId = lastAssignments.map((row: typeof UserHomePlace) => ({ user_id: row.user_id, home_place_id: row.home_place_id }))
  const actualAssignments = await shuffle()
  const rowsArray = Object.entries(actualAssignments.ids)
  const actualAssignmentsArray = rowsArray.map((result) => ({
    user_id: parseInt(result[0], 10),
    home_place_id: result[1],
  }))

  const areSomeTaskRepeated = lastAssignmentsId.map((lastRow: typeof UserHomePlace)=>{
    const actualRow = actualAssignmentsArray.find((actual)=>{
      return actual.user_id === lastRow.user_id
    })
    if(isEqual(actualRow, lastRow)){
      return true
    }
    return false
  })
  if(areSomeTaskRepeated.some((v:any)=>v)){
    console.log('Chore repeated, retrying...')
    return getChores()
  }else{
    console.log('Saving chore in DB...')
    await insertAssignment(actualAssignments.ids)
    return actualAssignments.names
  }
}

export async function areAllUsersReady(bot: typeof TelegramBot, msg:typeof Message){
  const chatMembersCount = await bot.getChatMemberCount(msg.chat.id)
  const savedUsers = await getAllUsers()
  if(chatMembersCount - 1 === savedUsers.length){
    return true
  }else{
    return false
  }
}

export async function askForUserInfo(bot: typeof TelegramBot, msg: typeof Message){
  bot.sendMessage(msg.chat.id, "Quien esta? (necesito que todos me digan esto culia)", {
    "reply_markup": {
        "keyboard": [[{text: USER_READY_MESSAGE}]]
    }
});
}