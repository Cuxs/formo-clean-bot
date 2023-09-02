import schedule from 'node-schedule'
import TelegramBot, { Message } from "node-telegram-bot-api";

const rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = 1;
rule.hour = 10;
rule.minute = 51;

export function runAutomation(msg: Message, bot: TelegramBot) {
  const job = schedule.scheduleJob(rule, function () {
    bot.sendMessage(msg.chat.id, 'Bueno, llegó el momento:')
  });
}
