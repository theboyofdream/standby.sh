import { Header } from "@/components/header";
import ClockPage from "@/pages/clock-page";
import CountdownPage from "@/pages/countdown-page";
import { useUrlState } from "@/hooks/useUrlState";

export default function App() {
  const { page } = useUrlState();

  return (
    <main className="flex flex-col gap-3 flex-1 w-screen h-screen p-4 font-mono select-none">
      <Header />
      {/* <ClocksPage/> */}
      {page === "clocks" ? <ClockPage /> : <CountdownPage />}
    </main>
  );
}
