import prisma from "../prisma";

export const createMessage = async (data: {
  sessionId: string;
  userId: string;
  question: string;
  answer: string;
  drillSuggestion: string;
}) => {
  return prisma.chatMessage.create({ data });
};

export const findMessagesBySessionId = async (sessionId: string) => {
  return prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
};
