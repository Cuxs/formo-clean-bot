import schedule from 'node-schedule'
import TelegramBot, { Message } from "node-telegram-bot-api";
import { getChores } from './utils';

const rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = 1;
rule.hour = 20
rule.minute = 56;

export function runAutomation(msg: Message, bot: TelegramBot) {
  const job = schedule.scheduleJob(rule, async function () {
    bot.sendMessage(msg.chat.id, 'Bueno, llegó el momento papijas:')
    const chores = await getChores()
    const text = Object.entries(chores).map(([user, chore])=>`@${user}: ${chore}`).join('\n')
    bot.sendMessage(msg.chat.id, text)
  });
}