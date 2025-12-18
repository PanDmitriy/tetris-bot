import { prisma } from '../db';

export interface CreateUserData {
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export async function getOrCreateUser(data: CreateUserData) {
  let user = await prisma.user.findUnique({
    where: { userId: data.userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        userId: data.userId,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  } else {
    // Update user info if changed
    user = await prisma.user.update({
      where: { userId: data.userId },
      data: {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  }

  return user;
}

export async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { userId },
    include: {
      gameResults: {
        orderBy: { score: 'desc' },
        take: 1,
      },
    },
  });

  if (!user) {
    return null;
  }

  const stats = await prisma.userStats.findUnique({
    where: { userId: user.id },
  });

  return {
    user,
    stats,
    bestGame: user.gameResults[0] || null,
  };
}



