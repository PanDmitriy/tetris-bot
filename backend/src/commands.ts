import { Bot } from 'grammy';
import { getUserStats } from './services/userService';
import { getLeaderboard } from './services/gameService';
import { getOrCreateUser } from './services/userService';

export function setupCommands(bot: Bot) {
  bot.command('start', async (ctx) => {
    if (ctx.from) {
      await getOrCreateUser({
        userId: ctx.from.id.toString(),
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
      });
    }

    await ctx.reply(
      '🎮 Добро пожаловать в Tetris Racing!\n\n' +
        'Используйте команды:\n' +
        '/play - Начать игру\n' +
        '/stats - Ваша статистика\n' +
        '/leaderboard - Таблица лидеров\n' +
        '/help - Помощь'
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      '📖 Помощь по игре:\n\n' +
        '🎯 Цель: Управляйте машинкой и избегайте падающих блоков\n\n' +
        '🎮 Управление:\n' +
        '• Стрелки влево/вправо - движение\n' +
        '• Свайпы влево/вправо - движение (на мобильных)\n\n' +
        '📊 Статистика:\n' +
        '• Очки начисляются за пройденное расстояние\n' +
        '• Бонусы за избежание блоков\n\n' +
        'Удачи! 🚗💨'
    );
  });

  bot.command('play', async (ctx) => {
    const webAppUrl = process.env.WEBAPP_URL || 'http://localhost:5173';
    await ctx.reply('🎮 Запускаем игру...', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🚗 Играть',
              web_app: { url: webAppUrl },
            },
          ],
        ],
      },
    });
  });

  bot.command('stats', async (ctx) => {
    const userId = ctx.from?.id.toString();
    if (!userId) {
      await ctx.reply('❌ Не удалось определить пользователя.');
      return;
    }

    try {
      const statsData = await getUserStats(userId);
      
      if (!statsData || !statsData.stats) {
        await ctx.reply(
          '📊 Ваша статистика:\n\n' +
            'Вы еще не играли. Начните игру командой /play!'
        );
        return;
      }

      const { stats, bestGame } = statsData;
      const avgScore = stats.totalGames > 0 
        ? Math.floor(Number(stats.totalScore) / stats.totalGames)
        : 0;
      const avgDistance = stats.totalGames > 0
        ? Math.floor(stats.totalDistance / stats.totalGames)
        : 0;

      await ctx.reply(
        '📊 Ваша статистика:\n\n' +
          `🎮 Игр сыграно: ${stats.totalGames}\n` +
          `🏆 Лучший результат: ${stats.bestScore} очков\n` +
          `📏 Лучшее расстояние: ${Math.floor(stats.bestDistance)}m\n` +
          `⏱ Лучшее время: ${Math.floor(stats.bestTime / 1000)}s\n` +
          `📈 Средний результат: ${avgScore} очков\n` +
          `📊 Среднее расстояние: ${avgDistance}m\n` +
          `🎯 Всего блоков избежано: ${stats.totalBlocksAvoided}`
      );
    } catch (error) {
      console.error('Error getting stats:', error);
      await ctx.reply('❌ Произошла ошибка при получении статистики.');
    }
  });

  bot.command('leaderboard', async (ctx) => {
    try {
      const leaderboard = await getLeaderboard(10);
      
      if (leaderboard.length === 0) {
        await ctx.reply('🏆 Таблица лидеров:\n\nПока нет результатов.');
        return;
      }

      let message = '🏆 Топ-10 игроков:\n\n';
      
      leaderboard.forEach((result, index) => {
        const username = result.user.username 
          ? `@${result.user.username}`
          : result.user.firstName || 'Игрок';
        message += `${index + 1}. ${username} - ${result.score} очков\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      await ctx.reply('❌ Произошла ошибка при получении таблицы лидеров.');
    }
  });
}

