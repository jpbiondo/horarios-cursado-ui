import { StrictMode } from "react";
import { ThemeProvider } from "next-themes";
import "./index.css";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <StrictMode>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        value={{ dark: "dark", light: "light" }}
      >
        <TooltipProvider>
          <Outlet />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
