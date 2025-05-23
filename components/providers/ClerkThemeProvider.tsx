"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

interface ClerkThemeProviderProps {
  children: React.ReactNode;
}

export default function ClerkThemeProvider({
  children,
}: ClerkThemeProviderProps) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
          colorPrimary: theme === "dark" ? "#ffffff" : "#000000",
          colorBackground: theme === "dark" ? "#0a0a0a" : "#ffffff",
          colorInputBackground: theme === "dark" ? "#171717" : "#ffffff",
          colorInputText: theme === "dark" ? "#ffffff" : "#000000",
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: theme === "dark" ? "#ffffff" : "#000000",
            color: theme === "dark" ? "#000000" : "#ffffff",
            "&:hover": {
              backgroundColor: theme === "dark" ? "#e5e5e5" : "#333333",
            },
          },
          card: {
            backgroundColor: theme === "dark" ? "#0a0a0a" : "#ffffff",
            border:
              theme === "dark" ? "1px solid #262626" : "1px solid #e5e5e7",
          },
          headerTitle: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
          headerSubtitle: {
            color: theme === "dark" ? "#a1a1aa" : "#6b7280",
          },
          socialButtonsBlockButton: {
            backgroundColor: theme === "dark" ? "#171717" : "#ffffff",
            border:
              theme === "dark" ? "1px solid #262626" : "1px solid #e5e5e7",
            color: theme === "dark" ? "#ffffff" : "#000000",
            "&:hover": {
              backgroundColor: theme === "dark" ? "#262626" : "#f9fafb",
            },
          },
          dividerLine: {
            backgroundColor: theme === "dark" ? "#262626" : "#e5e5e7",
          },
          dividerText: {
            color: theme === "dark" ? "#a1a1aa" : "#6b7280",
          },
          formFieldLabel: {
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
          footerActionText: {
            color: theme === "dark" ? "#a1a1aa" : "#6b7280",
          },
          footerActionLink: {
            color: theme === "dark" ? "#ffffff" : "#000000",
            "&:hover": {
              color: theme === "dark" ? "#e5e5e5" : "#333333",
            },
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
