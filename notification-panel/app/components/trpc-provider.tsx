"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/server/client";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({});
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `/api/trpc`,
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
