"use client";

import { useEffect, useState } from "react";

const StagewiseToolbar = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stagewiseConfig = {
    plugins: [],
  };

  // Dynamic import to avoid SSR issues
  useEffect(() => {
    // Only initialize in development mode and on client side
    if (!isClient || process.env.NODE_ENV !== "development") {
      return;
    }

    const initStagewise = async () => {
      try {
        const { StagewiseToolbar } = await import("@stagewise/toolbar-next");

        // Create a container for the toolbar if it doesn't exist
        let toolbarContainer = document.getElementById(
          "stagewise-toolbar-container"
        );
        if (!toolbarContainer) {
          toolbarContainer = document.createElement("div");
          toolbarContainer.id = "stagewise-toolbar-container";
          document.body.appendChild(toolbarContainer);
        }

        // Initialize the toolbar
        const { createRoot } = await import("react-dom/client");
        const root = createRoot(toolbarContainer);
        root.render(<StagewiseToolbar config={stagewiseConfig} />);
      } catch (error) {
        console.warn("Stagewise toolbar could not be loaded:", error);
      }
    };

    initStagewise();
  }, [isClient]);

  return null;
};

export default StagewiseToolbar;
