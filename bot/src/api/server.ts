import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { validateInitData } from './middleware/validateInitData.js';
import type { PlategaService } from '../services/platega.service.js';
import type { AMLBotService } from '../services/amlbot.service.js';
import type { NotifyService } from '../services/notify.service.js';

export function createApiServer(
  platega: PlategaService,
  amlbot: AMLBotService,
  notifyService: NotifyService
) {
  const app = new Hono();

  app.use('*', logger());
  app.use('*', cors({ origin: process.env.WEBAPP_URL || '*' }));

  app.get('/health', (c) => c.json({ status: 'ok' }));

  // Создание платежа за AML-проверку
  app.post('/api/payments/create-aml', validateInitData, async (c) => {
    const user = c.get('telegramUser');
    const price = parseFloat(process.env.AML_CHECK_PRICE_USD || '0.70');

    const payment = await platega.createPayment(price, 'AML Wallet Check - Exvora');

    return c.json({
      success: true,
      transactionId: payment.transactionId,
      redirectUrl: payment.redirectUrl,
      amountUsd: price,
    });
  });

  // Webhook от Platega — здесь важно отправить уведомление в notify-бот
  app.post('/api/webhooks/platega', async (c) => {
    const body = await c.req.json();
    const signature = c.req.header('X-Signature') || '';

    if (!platega.verifyWebhook(body, signature)) {
      return c.json({ error: 'Invalid signature' }, 403);
    }

    // Если платёж успешно завершён — отправляем уведомление в notify-бот
    if (body.status === 'paid' || body.status === 'CONFIRMED') {
      const username = body.user?.username || 'unknown';
      const amount = parseFloat(process.env.AML_CHECK_PRICE_USD || '0.70');

      await notifyService.sendAmlPaymentNotification(username, amount);
    }

    return c.json({ received: true });
  });

  // AML проверка (вызывается после успешной оплаты)
  app.post('/api/aml/check', validateInitData, async (c) => {
    const { address, asset } = await c.req.json();

    if (!address || !asset) {
      return c.json({ error: 'address and asset required' }, 400);
    }

    const result = await amlbot.checkWallet(address, asset);
    return c.json({ success: true, result });
  });

  return app;
}
