import { AppError } from "@/core/data/AppError";
import { createApiHandler } from "@/core/helpers/Api";
import { prisma } from "@/core/helpers/db";
import { TASKS_API_SECRET } from "@/core/helpers/env";
import { startOfYesterday } from "date-fns";

export default createApiHandler((app) => {
  app.post<{
    Reply: { runs: number; runInstances: number };
  }>("/api/tasks/cleanup-runs", async (request) => {
    const { authorization } = request.headers;

    if (authorization !== `Token ${TASKS_API_SECRET}`) {
      throw new AppError("FORBIDDEN");
    }

    const oneDayAgo = startOfYesterday();

    const { count: runInstances } = await prisma.runInstance.deleteMany({
      where: { createdAt: { lte: oneDayAgo } },
    });

    const { count: runs } = await prisma.run.deleteMany({
      where: { createdAt: { lte: oneDayAgo } },
    });

    return { runs, runInstances };
  });
});
