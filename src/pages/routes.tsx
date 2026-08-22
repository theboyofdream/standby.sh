import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./landing-page";
import ClockPage from "./clocks";
import CountdownPage from "./timers";
import StopwatchPage from "./stopwatch";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { useApplyFontScale } from "@/hooks/useClockConfig";

function App() {
  useApplyFontScale();
  return (
    <BrowserRouter>
      <main className="flex min-h-screen w-full max-w-full flex-col gap-3 overflow-x-hidden p-4 pb-[4.5rem] sm:pb-4 font-mono select-none">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/clocks" element={<ClockPage />} />
          <Route path="/countdown" element={<CountdownPage />} />
          <Route path="/stopwatch" element={<StopwatchPage />} />
        </Routes>
      </main>
      <MobileNav />
    </BrowserRouter>
  );
}

export default App;
