import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile-sized
 *
 * This hook prevents hydration mismatches by:
 * 1. Starting with a stable initial state (false) on both server and client
 * 2. Only updating to the actual mobile state after client-side hydration
 * 3. Using an isClient flag to ensure consistent behavior
 *
 * @returns boolean - true if viewport is mobile-sized, false otherwise
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    // Mark that we're now on the client side
    setIsClient(true);

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return false during SSR and initial hydration to prevent mismatch
  return isClient ? isMobile : false;
}
