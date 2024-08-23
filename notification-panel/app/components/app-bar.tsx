"use client";

import * as Popover from "@radix-ui/react-popover";
import { BellIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GearIcon } from "@radix-ui/react-icons";
import { trpc } from "@/server/client";
import BouncingLoader from "./bouncing-loader";
import CreateNotificationModal from "./create-notification-modal";
import { Notification } from "@/server/models/notification";
import { NotificationType } from "@/server/models/notification-type";
import { formatMessage } from "../helpers/notification-formaters";

export default function AppBar() {
  const router = useRouter();
  const utils = trpc.useUtils();

  // State
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Queries
  const {
    data: unreadNotifications,
    isLoading: isLoadingUnreadNotifications,
    isFetching: isFetchingUnreadNotifications,
  } = trpc.notifications.getUnreadNotifications.useQuery();

  // Mutations
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();

  const notifications = unreadNotifications ?? [];
  const unreadCount = unreadNotifications?.length ?? 0;

  // Handlers
  const handleNotificationClick = (notification: Notification) => {
    // TODO: use enum for the notification type
    // TODO: think of the message handling should be here or after the notification is marked as seen
    if (notification.type === NotificationType.PlatformUpdate) {
      alert("1.2.3");
    } else if (notification.type === NotificationType.CommentTag) {
      router.push("/comments");
    } else if (notification.type === NotificationType.AccessGranted) {
      router.push("/chats");
    } else if (notification.type === NotificationType.JoinWorkspace) {
      router.push("/workspace");
    }

    if (!notification.read) {
      markAsReadMutation.mutate(
        { id: notification.id },
        {
          onSuccess: () => {
            utils.notifications.invalidate();
          },
        }
      );
    }

    setIsPopoverOpen(false);
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case NotificationType.PlatformUpdate:
        return "bg-green-100 text-green-900";
      case NotificationType.CommentTag:
        return "bg-yellow-100 text-yellow-900";
      case NotificationType.AccessGranted:
        return "bg-blue-100 text-blue-900";
      case NotificationType.JoinWorkspace:
        return "bg-purple-100 text-purple-900";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  return (
    <div className="w-full h-16 bg-gray-800 flex items-center justify-between px-4">
      <Link href="/">
        <div className="text-white text-xl">My App</div>
      </Link>

      <div className="relative">
        <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <Popover.Trigger asChild>
            <button
              onClick={() => setIsPopoverOpen((prev) => !prev)}
              className="text-white"
            >
              <BellIcon className="w-6 h-6" />

              {isLoadingUnreadNotifications || isFetchingUnreadNotifications ? (
                <BouncingLoader />
              ) : (
                unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )
              )}
            </button>
          </Popover.Trigger>
          <Popover.Content
            align="end"
            className="bg-white p-4 rounded-md shadow-lg w-64"
            sideOffset={10}
          >
            <div className="text-gray-700">
              <h3 className="text-lg font-semibold mb-2">
                Latest Notifications
              </h3>
              <ul className="space-y-2 mb-4">
                {notifications.map((notification: Notification) => (
                  <li
                    key={notification.id}
                    className={`text-sm border-b last:border-none p-2 cursor-pointer flex items-center space-x-2 ${
                      notification.read
                        ? "text-gray-500"
                        : "text-gray-900 font-bold"
                    } ${getNotificationStyle(notification.type)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Avatar or System Icon */}
                    <div className="flex-shrink-0">
                      {notification.type === NotificationType.PlatformUpdate ? (
                        <GearIcon className="w-6 h-6 text-gray-600" />
                      ) : (
                        <Image
                          src={
                            "https://res.cloudinary.com/dvbopv7th/image/upload/v1682845865/samples/bike.jpg"
                          }
                          alt="avatar"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                    </div>

                    <div>
                      <div>
                        {formatMessage(notification.type, notification.message)}
                      </div>

                      <div className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        }) + `${notification.read ? " (Seen)" : ""}`}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <CreateNotificationModal />
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
}
