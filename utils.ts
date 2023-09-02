import startOfWeek from 'date-fns/startOfWeek'
import { format } from "date-fns";

export const isStartOfWeek = ()=>{
  const today = format(new Date(), 'P')
  const startOfWeekDate = format(startOfWeek(new Date()),'P')
  return today === startOfWeekDate
}

