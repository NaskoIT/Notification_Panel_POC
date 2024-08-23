"use client";

import { trpc } from "@/server/client";
import PageLoader from "./components/page-loader";
import { useState } from "react";
import { format } from "date-fns";
import { NotificationType } from "@/server/models/notification-type";
import { formatMessage } from "./helpers/notification-formaters";

export default function Home() {
  const pageSize = 10;
  const [page, setPage] = useState(1);

  // Queries
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    isFetching: isFetchingNotifications,
  } = trpc.notifications.getNotifications.useQuery({ page, pageSize });

  const notificationsQueryResult = notificationsData ?? {
    notifications: [],
    total: 0,
  };

  const hasPreviousPage = page > 1;
  const hasNextPage =
    notificationsQueryResult &&
    notificationsQueryResult.notifications.length === pageSize;

  // Helpers
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

  const getStatusStyle = (read: boolean) => {
    return read ? "bg-gray-200 text-gray-600" : "bg-red-100 text-red-600";
  };

  if (isLoadingNotifications || isFetchingNotifications) {
    return <PageLoader />;
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-4">
        <div className="p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notificationsQueryResult?.notifications.map((notification) => (
                <tr
                  key={notification.id}
                  className={`cursor-pointer ${getNotificationStyle(
                    notification.type
                  )}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {notification.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatMessage(notification.type, notification.message)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(
                      new Date(notification.createdAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                        notification.read
                      )}`}
                    >
                      {notification.read ? "Read" : "Unread"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={!hasPreviousPage}
              className={`px-4 py-2 rounded-md ${
                hasPreviousPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            <span>Page {page}</span>

            <button
              onClick={() =>
                setPage((old) =>
                  !notificationsQueryResult ||
                  notificationsQueryResult.notifications.length < pageSize
                    ? old
                    : old + 1
                )
              }
              disabled={!hasNextPage}
              className={`px-4 py-2 rounded-md ${
                hasNextPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
