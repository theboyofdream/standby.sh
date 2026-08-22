import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import LandingPage from "./landing-page";
import ClockPage from "./clocks";
import CountdownPage from "./timers";
import StopwatchPage from "./stopwatch";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { useApplyFontScale } from "@/hooks/useClockConfig";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

function Layout() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const { theme, setTheme } = useTheme();

  // re-apply persisted theme class on mount (persist doesn't run side effect)
  // needed on landing where MenuDropdown is hidden
  useEffect(() => {
    setTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `d` toggles dark/light (as hinted on landing page)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "d" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setTheme]);

  return (
    <>
      <main
        className={cn(
          "flex min-h-screen w-full max-w-full flex-col overflow-x-hidden font-mono select-none",
          isLanding ? "p-0" : "gap-3 p-4 pb-[4.5rem] sm:pb-4"
        )}
      >
        {!isLanding && <Header />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/clocks" element={<ClockPage />} />
          <Route path="/countdown" element={<CountdownPage />} />
          <Route path="/stopwatch" element={<StopwatchPage />} />
        </Routes>
      </main>
      {!isLanding && <MobileNav />}
    </>
  );
}

function App() {
  useApplyFontScale();
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
