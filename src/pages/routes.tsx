import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./landing-page";
import ClockPage from "./clocks";
import CountdownPage from "./timers";
import { Header } from "@/components/header";

function App() {
  return (
    <main className="flex flex-col gap-3 flex-1 w-screen h-screen p-4 font-mono select-none">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/clocks" element={<ClockPage />} />
          <Route path="/countdown" element={<CountdownPage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
