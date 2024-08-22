"use client";

import { trpc } from "@/server/client";

export default function Home() {
  const result = trpc.notifications.getNotifications.useQuery();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>{JSON.stringify(result.data)}</div>
    </main>
  );
}
