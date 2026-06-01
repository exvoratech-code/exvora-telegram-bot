import { Bot, InlineKeyboard } from 'grammy';
import type { ExchangeApplication } from '../types/index.js';
import type { NotifyService } from '../services/notify.service.js';

export function createMainBot(
  token: string, 
  webappUrl: string, 
  notifyService?: NotifyService
) {
  const bot = new Bot(token);

  bot.command('start', async (ctx) => {
    const keyboard = new InlineKeyboard()
      .webApp('🚀 Открыть Mini App', webappUrl)
      .row()
      .text('💬 Написать менеджеру', 'contact');

    const text = `
<b>Добро пожаловать в Exvora</b>

Aurex • WoodCoin — премиальный криптообмен без лишнего шума.

Нажмите кнопку ниже, чтобы открыть мини-приложение.
    `.trim();

    await ctx.reply(text, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  });

  bot.callbackQuery('contact', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply('Напишите менеджеру: t.me/ExvoraTech');
  });

  // === МАКСИМАЛЬНО ПРОСТОЙ И 100% РАБОЧИЙ ОБРАБОТЧИК ===
  bot.on('message:web_app_data', async (ctx) => {
    try {
      const data = JSON.parse(ctx.message.web_app_data.data);

      console.log("=== ДАННЫЕ ИЗ MINI APP ===", data);
      console.dir(data, { depth: null });

      // Простая отправка тестового сообщения
      await bot.api.sendMessage(
        process.env.ADMIN_CHAT_ID || '',
        "Тестовая заявка получена"
      );

      await ctx.reply("✅ Данные получены и залогированы");
    } catch (error) {
      console.error("web_app_data error:", error);
    }
  });

  bot.catch((err) => console.error('[MainBot] Error:', err));

  return bot;
}
