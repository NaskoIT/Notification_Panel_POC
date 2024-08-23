import { NotificationType } from "@/server/models/notification-type";

export function formatMessage(type: string, data: string) {
  switch (type) {
    case NotificationType.PlatformUpdate:
      return "New features - see what’s new";
    case NotificationType.AccessGranted:
      return `'${data}' shared a chat with you`;
    case NotificationType.CommentTag:
      return `'${data}' tagged you in a comment`;
    case NotificationType.JoinWorkspace:
      return `'${data}' joined your workspace`;
    default:
      return "";
  }
}
