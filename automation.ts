const schedule = require('node-schedule');
const TelegramBot = require("node-telegram-bot-api");
const { getChores } = require('./utils');
const { Message } = require('node-telegram-bot-api')


const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 1;
rule.hour = 11
rule.minute = 34

const rule2 = new schedule.RecurrenceRule();
rule2.hour = 9
rule2.minute = 32

const rule3 = new schedule.RecurrenceRule();
rule3.dayOfWeek = 4
rule3.hour = 23

export function runAutomation(msg: typeof Message, bot: typeof TelegramBot) {
  const job = schedule.scheduleJob(rule, async function () {
    await bot.sendMessage(msg.chat.id, 'Bueno, llegó el momento papijas:')
    const chores = await getChores()
    const text = Object.entries(chores).map(([user, chore])=>`@${user}: ${chore}`).join('\n')
    await bot.sendMessage(msg.chat.id, text)
  });

  const job2 = schedule.scheduleJob(rule2, async function() {

  })

  const job3 = schedule.scheduleJob(rule3, async function() {
    await bot.sendMessage(msg.chat.id, 'Locooo es jueves, dia de sacar la basura (secos) \mLa Basssssura')
  })
}