import 'dotenv/config';
import { serve } from '@hono/node-server';
import { createMainBot } from './bots/main.bot.js';
import { createNotifyBot } from './bots/notify.bot.js';
import { createApiServer } from './api/server.js';
import { PlategaService } from './services/platega.service.js';
import { AMLBotService } from './services/amlbot.service.js';
import { NotifyService } from './services/notify.service.js';

const {
  BOT_TOKEN,
  NOTIFY_BOT_TOKEN,
  WEBAPP_URL,
  ADMIN_CHAT_ID,
  PORT = '3001',
} = process.env;

if (!BOT_TOKEN || !NOTIFY_BOT_TOKEN || !WEBAPP_URL) {
  console.error('❌ Missing required env variables (BOT_TOKEN, NOTIFY_BOT_TOKEN, WEBAPP_URL)');
  process.exit(1);
}

console.log('🚀 Starting Exvora Bots + API...');

// Services
const plategaService = new PlategaService();
const amlbotService = new AMLBotService();

// Bots
const notifyBot = createNotifyBot(NOTIFY_BOT_TOKEN);

// Notify service (used for both exchange applications and AML payments)
const notifyService = new NotifyService(
  notifyBot, 
  ADMIN_CHAT_ID || 0,
  process.env.FALLBACK_ADMIN_ID || undefined
);

// Main bot — передаём notifyService, чтобы заявки из Mini App сразу уходили в @ExvoraTechNotify
const mainBot = createMainBot(BOT_TOKEN, WEBAPP_URL, notifyService);

// API Server
const apiApp = createApiServer(plategaService, amlbotService, notifyService);

async function start() {
  // Start bots (long polling for development)
  await mainBot.start({ onStart: (info) => console.log(`✅ Main bot: @${info.username}`) });
  await notifyBot.start({ onStart: (info) => console.log(`✅ Notify bot: @${info.username}`) });

  // Start Hono API server
  const port = parseInt(PORT, 10);
  serve({ fetch: apiApp.fetch, port }, () => {
    console.log(`🌐 API server running on http://localhost:${port}`);
  });
}

process.on('SIGINT', () => {
  mainBot.stop();
  notifyBot.stop();
  process.exit(0);
});

start();
