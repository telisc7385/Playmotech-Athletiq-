import prisma from "../prisma";

export const getDashboardStats = async (userId: string) => {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      overallScore: true,
      createdAt: true,
    },
  });

  const totalSessions = sessions.length;
  const averageScore =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.overallScore, 0) / totalSessions
        )
      : 0;

  const scores = sessions.map((s) => ({
    date: s.createdAt.toISOString().split("T")[0],
    score: s.overallScore,
  }));

  let trend: "up" | "down" | "stable" = "stable";
  if (scores.length >= 2) {
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg =
      firstHalf.reduce((s, x) => s + x.score, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((s, x) => s + x.score, 0) / secondHalf.length;
    if (secondAvg > firstAvg + 0.5) trend = "up";
    else if (secondAvg < firstAvg - 0.5) trend = "down";
  }

  return { totalSessions, averageScore, scores, trend };
};
