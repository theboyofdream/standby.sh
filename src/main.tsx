import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from 'nuqs/adapters/react'
import "./assets/lagasignatica.otf";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NuqsAdapter>
    <App />
    <Toaster />
     </NuqsAdapter>
  </StrictMode>,
);
