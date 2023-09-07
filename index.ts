const { User } = require("./controller/user")
const { UserHomePlace } = require("./controller/userHomePlaces")

require('dotenv').config()
const TelegramBot = require("node-telegram-bot-api");
const { Message } = require("node-telegram-bot-api");
const { areAllUsersReady, askForUserInfo } = require("./utils");
const { runAutomation } = require("./automation");
const { USER_READY_MESSAGE } = require("./config");
const { getAllUsers, getUserByTelegramUserName, saveUser } = require("./controller/user");
const { isEmpty } = require("lodash");
const { getLastAssignments } = require("./controller/userHomePlaces");
const { getHomePlaceById } = require("./controller/homePlaces");

const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req: any, res: any) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const bot: typeof TelegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN as string, { polling: true });

bot.onText(/\/start/, async (msg: typeof Message) => {
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

bot.onText(new RegExp(USER_READY_MESSAGE),async (msg: typeof Message)=>{
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
bot.onText(/\/quemetoca/, async (msg: typeof Message) => {
  const userInstance = await getUserByTelegramUserName(msg.from?.id)
  const assignments = await getLastAssignments()
  const assignment = assignments.find((row: typeof UserHomePlace)=>{
    return row.user_id === userInstance[0].id
  })
  if(assignment){
    const place = await getHomePlaceById(assignment.home_place_id)
    const text = `A vos (@${userInstance[0].telegram_userName}) te toca mantener limpio: ${place.name}`
    await bot.sendMessage(msg.chat.id, text)
  }
  runAutomation(msg, bot)
})


bot.onText(/\/haytortitas/, async(msg: typeof Message)=>{
  const users = await getAllUsers()
  const userMentions = users.map((row: typeof User)=>`@${row.telegram_userName} `).join('')
  const text = `${userMentions} hay tortitas, bajen mamahuevos.`
  await bot.sendMessage(msg.chat.id, text)
})