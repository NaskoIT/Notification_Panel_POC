import { router } from "./trpc";
import { notificationsRouter } from "./routers/notificatiosRouter";

export const appRouter = router({
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
