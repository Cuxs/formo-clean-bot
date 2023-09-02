import startOfWeek from 'date-fns/startOfWeek'
import { format } from "date-fns";
import { getAllUsers } from './controller/user';
import { getAllHomePlaces } from './controller/homePlaces';
import { getAssignments, insertAssignment } from './controller/userHomePlaces';

export const isStartOfWeek = ()=>{
  const today = format(new Date(), 'P')
  const startOfWeekDate = format(startOfWeek(new Date()),'P')
  return today === startOfWeekDate
}

async function shuffle (){
  const users = await getAllUsers()
  const places = await getAllHomePlaces()
  
  const availablePlaces = [...places]
  
  const assignments = users.reduce((prev, curr)=>{
    const maxValue = availablePlaces.length
    const placeRandomIndex = Math.floor(Math.random() * maxValue)    
    prev.names[curr.name] = availablePlaces[placeRandomIndex].name
    prev.ids[curr.id] = availablePlaces[placeRandomIndex].id
    availablePlaces.splice(placeRandomIndex, 1)
    return prev
  }, {names:{}, ids:{}})
}
shuffle()