import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";

import "@/web/styles/index.css";

import { createRoot } from "react-dom/client";

import queryClient from "@/web/lib/query-client";

import App from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
