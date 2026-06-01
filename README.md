# Exvora Telegram Mini App + Bots

Премиальное Telegram Mini App в стиле **exvora.tech** (Aurex & WoodCoin).

## Особенности

- Два отдельных бота (главный + @ExvoraTechNotify)
- При успешной оплате AML-проверки ($0.70) в notify-бот приходит уведомление
- Мини-приложение в точной тёмной премиум-теме exvora.tech
- Форма записи на обмен + AML-проверка кошельков
- Полная защита секретов
- pnpm workspace

## Стек

**Backend:**
- Node.js + TypeScript
- grammY (Telegram bots)
- Hono (лёгкий HTTP-сервер + webhook'и)

**Frontend (Mini App):**
- Vite + React + TypeScript
- TailwindCSS
- Компоненты в стиле shadcn/ui

## Структура

```
exvora-telegram-bot/
├── bot/                 # Главный + Notify боты + API
├── webapp/              # Telegram Mini App
├── pnpm-workspace.yaml
└── package.json         # root
```

## Быстрый старт

### 1. Установка

```bash
cd ~/exvora-telegram-bot
pnpm install
```

(Если pnpm не установлен: `npm install -g pnpm`)

### 2. Настройка

```bash
cp .env.example .env
# Заполни .env (токены ботов, ключи Platega/AMLBot, ADMIN_CHAT_ID)
```

### 3. Запуск разработки

**Терминал 1:**
```bash
cd bot && pnpm dev
```

**Терминал 2:**
```bash
cd webapp && pnpm dev
```

### 4. Важно

- При успешной оплате AML в `ADMIN_CHAT_ID` приходит:
  > 💰 Новое пополнение 0.70$ за AML-проверку от @username
- Для production настрой webhook'и и `/setdomain` в BotFather.

### 4. Настройка ботов (@BotFather)

- Для главного бота: `/setwebapp` и `/setdomain`
- Добавь `@ExvoraTechNotify` в приватную группу менеджеров и дай права администратора

## Важные уведомления

При успешной оплате AML-проверки в `@ExvoraTechNotify` (или `ADMIN_CHAT_ID`) приходит сообщение:

```
💰 Новое пополнение 0.70$ за AML-проверку от @username
```

## Production

- Mini App → Vercel / Cloudflare Pages
- Bot + API → Railway, Render, VPS
- Обязательно настрой webhook'и Telegram и Platega

---

**Проект сделан в стиле exvora.tech — Aurex + WoodCoin**
