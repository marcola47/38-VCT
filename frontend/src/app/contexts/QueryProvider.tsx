"use client"
import { useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={ queryClient }>
      { children }
    </QueryClientProvider>
  )
}

export function TestQueryProvider({ children }: { children: React.ReactNode }) {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  
  return (
    <QueryClientProvider client={ testQueryClient }>
      { children }
    </QueryClientProvider>
  )
}