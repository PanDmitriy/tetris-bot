import { prisma } from '../db';

export interface GameResultData {
  userId: string;
  score: number;
  distance: number;
  time: number;
  blocksAvoided: number;
}

export async function saveGameResult(data: GameResultData) {
  const user = await prisma.user.findUnique({
    where: { userId: data.userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Save game result
  const gameResult = await prisma.gameResult.create({
    data: {
      userId: user.id,
      score: data.score,
      distance: data.distance,
      time: data.time,
      blocksAvoided: data.blocksAvoided,
    },
  });

  // Update or create user stats
  const existingStats = await prisma.userStats.findUnique({
    where: { userId: user.id },
  });

  if (existingStats) {
    await prisma.userStats.update({
      where: { userId: user.id },
      data: {
        totalGames: { increment: 1 },
        totalScore: { increment: BigInt(data.score) },
        bestScore: Math.max(existingStats.bestScore, data.score),
        bestDistance: Math.max(existingStats.bestDistance, data.distance),
        bestTime: Math.max(existingStats.bestTime, data.time),
        totalDistance: { increment: data.distance },
        totalTime: { increment: BigInt(data.time) },
        totalBlocksAvoided: { increment: data.blocksAvoided },
      },
    });
  } else {
    await prisma.userStats.create({
      data: {
        userId: user.id,
        totalGames: 1,
        totalScore: BigInt(data.score),
        bestScore: data.score,
        bestDistance: data.distance,
        bestTime: data.time,
        totalDistance: data.distance,
        totalTime: BigInt(data.time),
        totalBlocksAvoided: data.blocksAvoided,
      },
    });
  }

  return gameResult;
}

export async function getLeaderboard(limit: number = 10) {
  const topScores = await prisma.gameResult.findMany({
    orderBy: { score: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          userId: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return topScores;
}



