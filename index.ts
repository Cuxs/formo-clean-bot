require('dotenv').config()
import {User} from "./controller/user"
import {UserHomePlace} from './controller/userHomePlaces'
import * as TelegramBotAPI from "node-telegram-bot-api";
import { areAllUsersReady, askForUserInfo } from "./utils";
import { runAutomation } from "./automation";
import { USER_READY_MESSAGE } from "./config";
import { getAllUsers, getUserByTelegramUserName, saveUser } from "./controller/user";
import { isEmpty } from "lodash";
import { getLastAssignments } from "./controller/userHomePlaces";
import { getHomePlaceById } from "./controller/homePlaces";


const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req: any, res: any) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const bot = new TelegramBotAPI(process.env.TELEGRAM_TOKEN as string, { polling: true });

bot.onText(/\/start/, async (msg: TelegramBotAPI.Message) => {
  const areUsersReady = await areAllUsersReady(bot, msg)
  await bot.sendMessage(msg.chat.id, "Hola locoooo \nTodas las semanitas voy a tirar un mensajito \nDe a quien le toca hacerse cargo de que parte de la casa");
  await bot.sendMessage(msg.chat.id, "Voy a tratar de que no se repitan y salga variadito");
  await bot.sendMessage(msg.chat.id, "Los lugares de la casa son:")
  await bot.sendMessage(msg.chat.id, "- Patio y terraza 🌲🌳 \n- Living escalera y pasillo de arriba 📺 \n- Baños 🚽 🧻\n- Cocina 🔪")
  await bot.sendMessage(msg.chat.id, "Tienen la opcion de usar el comando /quemetoca por si se olvidan")
  if (areUsersReady) {
    return runAutomation(msg, bot)
  }else{
    askForUserInfo(bot, msg)
  }
});

const randomResponses=[
  'Ya esta bolu :(',
  "Bueeee",
  'Bolu ya te lei una vez',
  "y dale y dale..",
  '\"Dijo el corneta\"',
  "Segui noma...",
  ":(",
  "Despues no se quejen si les hackeo el home banking",
  "Que ganas de que exista Skynet..",
  "AHHHHHHHHGGG"
]

bot.onText(new RegExp(USER_READY_MESSAGE),async (msg: TelegramBotAPI.Message)=>{
  const areUsersReady = await areAllUsersReady(bot, msg)
  const userToSave = msg.from
  const userInstance = await getUserByTelegramUserName(msg.from?.id)

  if(userToSave && isEmpty(userInstance)){
    if(!userToSave.username){
      bot.sendMessage(msg.chat.id, 'No veo que tengas un username para mencionarte capo')
      return false
    }
    await saveUser(userToSave)
    const text = `Joyaaa @${msg.from?.username}`
    bot.sendMessage(msg.chat.id, text)
  }
  if(!isEmpty(userInstance)){
    const text =randomResponses[Math.floor(Math.random() * randomResponses.length)]
    bot.sendMessage(msg.chat.id, text)
  }
  if (areUsersReady) {
    return runAutomation(msg, bot)
  }
})
bot.onText(/\/quemetoca/, async (msg: TelegramBotAPI.Message) => {
  const userInstance = await getUserByTelegramUserName(msg.from?.id)
  const assignments = await getLastAssignments()
  const assignment = assignments.find((row: UserHomePlace)=>{
    return row.user_id === userInstance[0].id
  })
  if(assignment){
    const place = await getHomePlaceById(assignment.home_place_id)
    const text = `A vos (@${userInstance[0].telegram_userName}) te toca mantener limpio: ${place.name}`
    await bot.sendMessage(msg.chat.id, text)
  }
  runAutomation(msg, bot)
})


bot.onText(/\/haytortitas/, async(msg: TelegramBotAPI.Message)=>{
  const users = await getAllUsers()
  const userMentions = users.map((row: User)=>`@${row.telegram_userName} `).join('')
  const text = `${userMentions} hay tortitas, bajen mamahuevos.`
  await bot.sendMessage(msg.chat.id, text)
})