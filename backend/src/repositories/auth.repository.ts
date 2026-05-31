import prisma from "../prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      sport: true,
      role: true,
      experienceLevel: true,
      createdAt: true,
    },
  });
};

export const createUser = async (data: {
  fullName: string;
  email: string;
  password: string;
  sport: string;
  role: string;
  experienceLevel: string;
}) => {
  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      sport: data.sport,
      role: data.role,
      experienceLevel: data.experienceLevel as any,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      sport: true,
      role: true,
      experienceLevel: true,
      createdAt: true,
    },
  });
};
