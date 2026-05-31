import prisma from "../prisma";

export const createSession = async (data: {
  userId: string;
  imagePath: string;
  overallScore: number;
  strengths: any;
  areasToImprove: any;
  priorityFix: string;
  drillSuggestion: string;
  confidenceLevel: string;
  rawResponse: any;
}) => {
  return prisma.session.create({ data });
};

export const findSessionById = async (id: string) => {
  return prisma.session.findUnique({ where: { id } });
};

export const findSessionsByUserId = async (userId: string) => {
  return prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const findUserSessionsPaginated = async (
  userId: string,
  skip: number,
  take: number
) => {
  return prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
};

export const countUserSessions = async (userId: string) => {
  return prisma.session.count({ where: { userId } });
};

export const getSessionWithChat = async (sessionId: string) => {
  return prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      chatMessages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
};
