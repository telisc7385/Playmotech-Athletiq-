import { Request, Response } from "express";
import { successResponse } from "../utils/response";
import * as dashboardService from "../services/dashboard.service";

export const getStats = async (req: Request, res: Response) => {
  const stats = await dashboardService.getStats(req.user!.userId);
  successResponse(res, stats, "Dashboard stats fetched");
};
