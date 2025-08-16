import { StrictMode } from "react";

import "@/web/styles/index.css";

import { createRoot } from "react-dom/client";

import App from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
