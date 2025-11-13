import { Header } from "@/components/header";
import ClocksPage from "@/pages/Clocks";
import CountdownPage from "@/pages/Countdown";
import { useUrlState } from "@/hooks/useUrlState";

export default function App() {
  const { page } = useUrlState();

  return (
    <main className="flex flex-col gap-3 flex-1 w-screen h-screen p-4 font-mono select-none">
      <Header />
      {/* <ClocksPage/> */}
      {page === "clocks" ? <ClocksPage /> : <CountdownPage />}
    </main>
  );
}
