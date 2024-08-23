import { z } from "zod";

export const notificationSchema = z.object({
  type: z.string().min(1),
  message: z.string().min(1),
});
