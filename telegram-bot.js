import CharacterAI from "characterai.js";
import * as dotenv from "dotenv";
import { Telegraf, Markup } from "telegraf";

dotenv.config();


const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply('Welcome!')
})

bot.on('message', (ctx) => {
  if (ctx.message.text.startsWith("!ai")) {
    const mensaje = ctx.message.text.split("!ai ")[1];
    const { username } = ctx.from;
    try {
      ctx.replyWithChatAction('typing');
      getCharResponse(`${username} says:\n${mensaje}`)
        .then((response) => ctx.reply(response))
        .catch((error) => console.log(error))
    } catch (error) {
      console.log(error)
    }
  } else if (ctx.message.reply_to_message && ctx.message.reply_to_message.from.id === bot.id) {
    const mensaje = ctx.message.text;
    const { username } = ctx.from;
    try {
      ctx.replyWithChatAction('typing');
      getCharResponse(`${username} says:\n${mensaje}`)
        .then((response) => ctx.reply(response))
        .catch((error) => console.log(error))
    } catch (error) {
      console.log(error)
    }
  }
});

const getCharResponse = async (message) => {
  const characterAI = new CharacterAI(process.env.AI_KEY, process.env.CHARACTER_ID);
  const chat = await characterAI.continueOrCreateChat();
  const response = await chat.sendAndAwaitResponse({ message, singleReply: true });
  return response;
};

bot.launch()
