import { Header } from "@/components/header";
import ClocksPage from "@/pages/Clocks";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <main className="flex flex-col gap-3 flex-1 w-screen h-screen p-4 font-mono select-none">
      <Header />
      <ClocksPage />
      {/*<Footer />*/}
    </main>
  );
}

function Footer() {
  return (
    <span className="flex sm:hidden fixed bottom-4">
      <Button variant={"link"}>Clocks</Button>
      <Button variant={"link"}>Countdown</Button>
    </span>
  );
}
