import schedule from 'node-schedule'
import TelegramBot, { Message } from "node-telegram-bot-api";
import { getChores } from './utils';

const rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = 1;
rule.hour = 16;
rule.minute = 28;

export function runAutomation(msg: Message, bot: TelegramBot) {
  const job = schedule.scheduleJob(rule, async function () {
    bot.sendMessage(msg.chat.id, 'Bueno, llegó el momento:')
    const chores = await getChores()
    const text = Object.entries(chores).map(([user, chore])=>`@${user}: ${chore}`).join('\n')
    bot.sendMessage(msg.chat.id, text)
  });
}