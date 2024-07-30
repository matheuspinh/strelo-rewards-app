// In Next.js, this file would be called: app/providers.jsx

'use client'

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } 

    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  
}

export default function Providers({ children }: { children: React.ReactNode }) {

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}