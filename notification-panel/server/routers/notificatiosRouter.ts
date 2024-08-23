import { z } from "zod";
import { procedure, router } from "../trpc";
import { PrismaClient } from "@prisma/client";
import { notificationSchema } from "../schema/notification-schema";
import { Notification } from "../models/notification";
import { NotificationType } from "../models/notification-type";

const prisma = new PrismaClient();

export const notificationsRouter = router({
  getNotifications: procedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).default(10),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize } = input;
      const skip = (page - 1) * pageSize;

      const notifications = await prisma.notification.findMany({
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalNotifications = await prisma.notification.count();

      return {
        notifications,
        total: totalNotifications,
      };
    }),
  getUnreadNotifications: procedure.query(async () => {
    return await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        read: false,
      },
    });
  }),
  getUnreadCount: procedure.query(async () => {
    return await prisma.notification.count({
      where: {
        read: false,
      },
    });
  }),
  addNotification: procedure
    .input(notificationSchema)
    .mutation(async ({ input }) => {
      return await prisma.notification.create({
        data: input,
      });
    }),
  markAsRead: procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.notification.update({
        where: { id: input.id },
        data: { read: true },
      });
    }),
});
