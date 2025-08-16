import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { AppFallback, Toaster } from "@/web/components/ui";
import { useSession } from "@/web/lib/auth";
import queryClient from "@/web/lib/query-client";
import { router } from "@/web/lib/router/router.index";
import { ThemeProvider } from "@/web/lib/theme/theme.provider";

export default function App() {
  const { data: auth, isPending } = useSession();

  if (isPending) {
    return <AppFallback />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} context={{ auth }} />
        <Toaster richColors position="bottom-center" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
