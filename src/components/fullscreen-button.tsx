import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useFullscreen } from "@/hooks/use-fullscreen";

export function FullScreenButton() {
  const { isFullscreen, toggle: toggleFullscreen} = useFullscreen()
  // const [isFullscreen, setIsFullscreen] = useState(false);

  // const toggleFullscreen = () => {
  //   const clockElement = document.getElementById("clock");
  //   if (!clockElement) return;
  //   if (!isFullscreen) {
  //     // Enter fullscreen
  //     if (clockElement.requestFullscreen) {
  //       clockElement.requestFullscreen();
  //     } else if (clockElement.webkitRequestFullscreen) {
  //       /* Safari */
  //       clockElement.webkitRequestFullscreen();
  //     } else if (clockElement.msRequestFullscreen) {
  //       /* IE11 */
  //       clockElement.msRequestFullscreen();
  //     }
  //     setIsFullscreen(true);
  //   } else {
  //     // Exit fullscreen
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //     } else if (document.webkitExitFullscreen) {
  //       /* Safari */
  //       document.webkitExitFullscreen();
  //     } else if (document.msExitFullscreen) {
  //       /* IE11 */
  //       document.msExitFullscreen();
  //     }
  //     setIsFullscreen(false);
  //   }
  // };

  return (
    <Button variant="ghost" onClick={()=>toggleFullscreen()}>
      {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
    </Button>
  );
}
