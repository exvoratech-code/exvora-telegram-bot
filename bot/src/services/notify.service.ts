import { Bot, InlineKeyboard } from 'grammy';
import type { ExchangeApplication } from '../types/index.js';

export class NotifyService {
  constructor(
    private notifyBot: Bot,
    private adminChatId: string | number,
    private fallbackAdminId?: string | number
  ) {}

  /**
   * Отправляет красивую заявку на обмен в notify-бот (или fallback)
   */
  async sendExchangeApplication(app: ExchangeApplication): Promise<boolean> {
    console.log('[NotifyService] Preparing exchange application notification...');
    console.log('[NotifyService] Application data:', {
      firstName: app.firstName,
      lastName: app.lastName,
      telegramUsername: app.telegramUsername,
      location: `${app.city}, ${app.country}`,
      userId: app.userId,
      time: app.createdAt,
    });

    const time = new Date(app.createdAt).toLocaleString('ru-RU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const message = `
🔔 <b>НОВАЯ ЗАЯВКА НА ОБМЕН</b>

👤 <b>Имя:</b> ${app.firstName} ${app.lastName || ''}
📱 <b>Telegram:</b> @${app.telegramUsername}
🌍 <b>Город / Страна:</b> ${app.city}, ${app.country}

🕐 <b>Получена:</b> ${time}
🆔 <b>User ID:</b> <code>${app.userId ?? 'неизвестен'}</code>

<i>Менеджер, пожалуйста, свяжитесь с клиентом в течение 5–10 минут.</i>
    `.trim();

    const keyboard = new InlineKeyboard()
      .url('💬 Ответить менеджеру', `https://t.me/${app.telegramUsername}`)
      .row()
      .url('📋 Открыть чат', `https://t.me/${app.telegramUsername}`);

    try {
      await this.notifyBot.api.sendMessage(this.adminChatId, message, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });

      console.log(`[NotifyService] ✅ Exchange application successfully sent to chat ${this.adminChatId}`);
      return true;

    } catch (error: any) {
      // Выводим максимально подробную информацию об ошибке от Telegram
      const errorInfo = {
        message: error.message,
        description: error.description || error.payload?.description,
        error_code: error.error_code,
        fullError: error,
      };
      console.error('[NotifyService] ❌ Failed to send to primary admin chat. Полная ошибка:', errorInfo);

      // Fallback логика
      if (this.fallbackAdminId) {
        try {
          const fallbackMessage = `⚠️ <b>ВНИМАНИЕ!</b> Не удалось отправить заявку в основную группу.\n\n${message}`;
          await this.notifyBot.api.sendMessage(this.fallbackAdminId, fallbackMessage, {
            parse_mode: 'HTML',
            reply_markup: keyboard,
          });
          console.log(`[NotifyService] ✅ Fallback message sent to ${this.fallbackAdminId}`);
          return true;
        } catch (fallbackError: any) {
          console.error('[NotifyService] ❌ Fallback also failed. Ошибка:', {
            message: fallbackError.message,
            description: fallbackError.description,
          });
        }
      }

      // Если fallback не помог — логируем максимально подробно
      console.error('[NotifyService] CRITICAL: Could not deliver exchange application notification', {
        app,
        primaryChat: this.adminChatId,
        fallback: this.fallbackAdminId,
      });
      return false;
    }
  }

  /**
   * Специальное уведомление при успешной оплате AML-проверки
   */
  async sendAmlPaymentNotification(telegramUsername: string, amountUsd: number = 0.70): Promise<boolean> {
    const message = `💰 Новое пополнение <b>${amountUsd}$</b> за AML-проверку от @${telegramUsername}`;

    try {
      await this.notifyBot.api.sendMessage(this.adminChatId, message, { parse_mode: 'HTML' });
      console.log(`[NotifyService] ✅ AML payment notification sent for @${telegramUsername}`);
      return true;
    } catch (error) {
      console.error('[NotifyService] ❌ Failed to send AML notification:', error);
      return false;
    }
  }
}

