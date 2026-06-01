import { Bot } from 'grammy';

export function createNotifyBot(token: string) {
  const bot = new Bot(token);

  bot.catch((err) => {
    console.error('[NotifyBot] Error:', err);
  });

  return bot;
}
