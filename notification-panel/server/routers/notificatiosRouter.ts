import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const notificationsRouter = router({
  getNotifications: procedure.query(async () => {
    return await prisma.notification.findMany();
  }),
  addNotification: procedure
    .input(
      z.object({
        type: z.string(),
        message: z.string(),
      })
    )
    .mutation(({ input, ctx: context }) => {
      return prisma.notification.create({
        data: input,
      });
    }),
});
