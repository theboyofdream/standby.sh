import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import "./assets/lagasignatica.otf";
import "./index.css";
// import App from "./App.tsx";
import Routes from "./pages/routes.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NuqsAdapter>
      <Routes />
      <Toaster />
    </NuqsAdapter>
  </StrictMode>
);
