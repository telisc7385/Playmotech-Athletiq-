import * as dashboardRepo from "../repositories/dashboard.repository";

export const getStats = async (userId: string) => {
  return dashboardRepo.getDashboardStats(userId);
};
