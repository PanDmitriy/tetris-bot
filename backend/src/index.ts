import 'dotenv/config';
import { Bot, webhookCallback } from 'grammy';
import express from 'express';
import { prisma } from './db';
import { setupCommands } from './commands';
import { setupHandlers } from './handlers';

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set in environment variables');
}

const bot = new Bot(BOT_TOKEN);
const app = express();

// Middleware
app.use(express.json());

// Setup bot
setupCommands(bot);
setupHandlers(bot);

// Webhook endpoint (for production)
if (process.env.NODE_ENV === 'production') {
  app.use('/webhook', webhookCallback(bot, 'express'));
} else {
  // Polling for development
  bot.start();
  console.log('Bot is running in polling mode');
}

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());



