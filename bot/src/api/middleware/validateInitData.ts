import { createHmac } from 'crypto';
import type { Context, Next } from 'hono';
import type { WebAppUser } from '../../types/index.js';

export async function validateInitData(c: Context, next: Next) {
  const initData = c.req.header('X-Telegram-Init-Data') || 
                   (await c.req.json().catch(() => ({}))).initData;

  if (!initData) {
    return c.json({ error: 'initData is required' }, 401);
  }

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    return c.json({ error: 'Server misconfiguration' }, 500);
  }

  const isValid = verifyTelegramWebAppData(initData, botToken);
  if (!isValid) {
    return c.json({ error: 'Invalid initData signature' }, 403);
  }

  const user = parseUserFromInitData(initData);
  c.set('telegramUser', user);

  await next();
}

function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  if (!hash) return false;

  urlParams.delete('hash');

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return computedHash === hash;
}

function parseUserFromInitData(initData: string): WebAppUser | undefined {
  try {
    const params = new URLSearchParams(initData);
    const userRaw = params.get('user');
    return userRaw ? JSON.parse(userRaw) : undefined;
  } catch {
    return undefined;
  }
}
