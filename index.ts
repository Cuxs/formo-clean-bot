import TelegramBot, { Message } from "node-telegram-bot-api";
import { isStartOfWeek } from "./utils";
import { runAutomation } from "./automation";
require('dotenv').config()


const bot: TelegramBot = new TelegramBot(process.env.TELEGRAM_TOKEN as string, { polling: true });

bot.onText(/\/start/, async (msg: Message) => {
  await bot.sendMessage(msg.chat.id, "Hola locoooo \nTodas las semanitas voy a tirar un mensajito \nDe a quien le toca hacerse cargo de que parte de la casa");
  await bot.sendMessage(msg.chat.id, "Voy a tratar de que no se repitan y salga variadito");
  await bot.sendMessage(msg.chat.id, "Los lugares de la casa son:")
  await bot.sendMessage(msg.chat.id, "- Patio y terraza 🌲🌳 \n- Living escalera y pasillo de arriba 📺 \n- Baños 🚽 🧻\n- Cocina 🔪")
  await bot.sendMessage(msg.chat.id, "Tienen la opcion de usar el comando /quemetoca por si se olvidan")
  const text = `Como hoy ${isStartOfWeek()? 'es': 'no es'} inicio de semana, ${isStartOfWeek()?'vamos a asignar tareitas.': 'vamos a esperar al lunes para empezar.'}`
  await bot.sendMessage(msg.chat.id, text)

  runAutomation(msg, bot)
});