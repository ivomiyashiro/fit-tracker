import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

import { Toaster } from "@/web/components/ui";
import queryClient from "@/web/lib/query-client";
import { router } from "@/web/lib/router";
import { ThemeProvider } from "@/web/lib/theme/theme.provider";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-center" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
