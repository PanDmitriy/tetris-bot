import { Bot } from 'grammy';
import { getOrCreateUser } from './services/userService';
import { saveGameResult } from './services/gameService';

export function setupHandlers(bot: Bot) {
  // Handle new users
  bot.on('message', async (ctx) => {
    if (ctx.from) {
      await getOrCreateUser({
        userId: ctx.from.id.toString(),
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
      });
    }
  });

  // Handle web app data
  bot.on('message', async (ctx) => {
    if (ctx.message?.web_app?.data) {
      try {
        const data = JSON.parse(ctx.message.web_app.data);
        
        if (data.type === 'game_result') {
          const userId = ctx.from?.id.toString();
          if (!userId) return;

          // Ensure user exists
          await getOrCreateUser({
            userId,
            username: ctx.from?.username,
            firstName: ctx.from?.first_name,
            lastName: ctx.from?.last_name,
          });

          // Save game result
          await saveGameResult({
            userId,
            score: data.score || 0,
            distance: data.distance || 0,
            time: data.time || 0,
            blocksAvoided: data.blocksAvoided || 0,
          });

          await ctx.reply(
            `🎉 Игра завершена!\n\n` +
              `📊 Очки: ${data.score || 0}\n` +
              `📏 Расстояние: ${Math.floor(data.distance || 0)}m\n` +
              `⏱ Время: ${Math.floor((data.time || 0) / 1000)}s\n` +
              `🎯 Блоков избежано: ${data.blocksAvoided || 0}`
          );
        }
      } catch (error) {
        console.error('Error handling web app data:', error);
        await ctx.reply('❌ Произошла ошибка при сохранении результата игры.');
      }
    }
  });
}

