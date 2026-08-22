'use client';

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseFullscreenOptions {
  onEnter?: () => void;
  onExit?: () => void;
  onError?: (error: Error) => void;
}

// vendor-prefixed fullscreen API (older Safari/Firefox/IE)
type VendorDocument = Document & {
  webkitFullscreenEnabled?: boolean;
  mozFullScreenEnabled?: boolean;
  msFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  mozCancelFullScreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

type VendorElement = Element & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  mozRequestFullScreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

export interface UseFullscreenReturn {
  isFullscreen: boolean;
  isSupported: boolean;
  enter: (element?: Element) => Promise<void>;
  exit: () => Promise<void>;
  toggle: (element?: Element) => Promise<void>;
  element: Element | null;
}

export function useFullscreen(
  targetRef: React.RefObject<Element> | null = null,
  options: UseFullscreenOptions = {}
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Check if fullscreen is supported
  const isSupported = Boolean(
    document.fullscreenEnabled ||
      (document as VendorDocument).webkitFullscreenEnabled ||
      (document as VendorDocument).mozFullScreenEnabled ||
      (document as VendorDocument).msFullscreenEnabled
  );

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as VendorDocument).webkitFullscreenElement ||
        (document as VendorDocument).mozFullScreenElement ||
        (document as VendorDocument).msFullscreenElement;

      const isCurrentlyFullscreen = Boolean(fullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
      setElement(fullscreenElement ?? null);

      if (isCurrentlyFullscreen) {
        optionsRef.current.onEnter?.();
      } else {
        optionsRef.current.onExit?.();
      }
    };

    const handleFullscreenError = () => {
      optionsRef.current.onError?.(
        new Error("Failed to enter fullscreen mode")
      );
    };

    // Add event listeners for different browsers
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    document.addEventListener("fullscreenerror", handleFullscreenError);
    document.addEventListener("webkitfullscreenerror", handleFullscreenError);
    document.addEventListener("mozfullscreenerror", handleFullscreenError);
    document.addEventListener("MSFullscreenError", handleFullscreenError);

    // Set initial state
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );

      document.removeEventListener("fullscreenerror", handleFullscreenError);
      document.removeEventListener(
        "webkitfullscreenerror",
        handleFullscreenError
      );
      document.removeEventListener("mozfullscreenerror", handleFullscreenError);
      document.removeEventListener("MSFullscreenError", handleFullscreenError);
    };
  }, []);

  const enter = useCallback(
    async (elementToFullscreen?: Element) => {
      if (!isSupported) {
        throw new Error("Fullscreen API is not supported");
      }

      const target =
        elementToFullscreen || targetRef?.current || document.documentElement as Element;

      if (!target) {
        throw new Error("No element provided for fullscreen");
      }

      try {
        const vendorTarget = target as VendorElement;
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        } else if (vendorTarget.webkitRequestFullscreen) {
          await vendorTarget.webkitRequestFullscreen();
        } else if (vendorTarget.mozRequestFullScreen) {
          await vendorTarget.mozRequestFullScreen();
        } else if (vendorTarget.msRequestFullscreen) {
          await vendorTarget.msRequestFullscreen();
        } else {
          throw new Error("Fullscreen API is not supported");
        }
      } catch (error) {
        optionsRef.current.onError?.(error as Error);
        throw error;
      }
    },
    [isSupported, targetRef]
  );

  const exit = useCallback(async () => {
    if (!isSupported) {
      throw new Error("Fullscreen API is not supported");
    }

    try {
      const vendorDoc = document as VendorDocument;
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (vendorDoc.webkitExitFullscreen) {
        await vendorDoc.webkitExitFullscreen();
      } else if (vendorDoc.mozCancelFullScreen) {
        await vendorDoc.mozCancelFullScreen();
      } else if (vendorDoc.msExitFullscreen) {
        await vendorDoc.msExitFullscreen();
      } else {
        throw new Error("Fullscreen API is not supported");
      }
    } catch (error) {
      optionsRef.current.onError?.(error as Error);
      throw error;
    }
  }, [isSupported]);

  const toggle = useCallback(
    async (elementToFullscreen?: Element) => {
      if (isFullscreen) {
        await exit();
      } else {
        await enter(elementToFullscreen);
      }
    },
    [isFullscreen, enter, exit]
  );

  return {
    isFullscreen,
    isSupported,
    enter,
    exit,
    toggle,
    element,
  };
}
