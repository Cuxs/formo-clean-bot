import startOfWeek from 'date-fns/startOfWeek'
import { format } from "date-fns";
import { getAllUsers } from './controller/user';
import { isEqual } from 'lodash'
import { getAllHomePlaces } from './controller/homePlaces';
import { getAssignments, getLastAssignments, insertAssignment } from './controller/userHomePlaces';


type AssignmentShuffle = {
  names: Record<string, string>
  ids: Record<string, number>
}

export const isStartOfWeek = () => {
  const today = format(new Date(), 'P')
  const startOfWeekDate = format(startOfWeek(new Date()), 'P')
  return today === startOfWeekDate
}

async function shuffle() {
  const users = await getAllUsers()
  const places = await getAllHomePlaces()

  const availablePlaces = [...places]

  return users.reduce((prev: AssignmentShuffle, curr) => {
    const maxValue = availablePlaces.length
    const placeRandomIndex = Math.floor(Math.random() * maxValue)
    prev.names[curr.name] = availablePlaces[placeRandomIndex].name
    prev.ids[curr.id] = availablePlaces[placeRandomIndex].id
    availablePlaces.splice(placeRandomIndex, 1)
    return prev
  }, { names: {}, ids: {} })
}
export async function getChores() {
  const lastAssignments = await getLastAssignments()
  const lastAssignmentsId = lastAssignments.map((row) => ({ user_id: row.user_id, home_place_id: row.home_place_id }))
  const actualAssignments = await shuffle()
  const rowsArray = Object.entries(actualAssignments.ids)
  const actualAssignmentsArray = rowsArray.map((result) => ({
    user_id: parseInt(result[0], 10),
    home_place_id: result[1],
  }))

  const areSomeTaskRepeated = lastAssignmentsId.map((lastRow)=>{
    const actualRow = actualAssignmentsArray.find((actual)=>{
      return actual.user_id === lastRow.user_id
    })
    if(isEqual(actualRow, lastRow)){
      return true
    }
    return false
  })
  if(areSomeTaskRepeated.some(v=>v)){
    console.log('Chore repeated, retrying...')
    return getChores()
  }else{
    console.log('Saving chore in DB...')
    await insertAssignment(actualAssignments.ids)
    return actualAssignments.names
  }
}