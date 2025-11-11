import { Header } from "@/components/header";
import ClocksPage from "@/pages/Clocks";

export default function App() {
  return (
    <main className="flex flex-col gap-3 flex-1 w-screen h-screen p-4 font-mono select-none">
      <Header />
      <ClocksPage />
    </main>
  );
}
