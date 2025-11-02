import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      onError: (error) => {
        const errorMessage = error instanceof Error
          ? error.message
          : "An unexpected error occurred";

        toast.error(errorMessage);
      },
    },
  },
});
