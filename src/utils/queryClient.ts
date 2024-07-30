import { QueryClient } from "@tanstack/react-query";

const SECOND_IN_MS = 1_000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * MINUTE_IN_MS,
      retry: false,
    },
  },
});