import { CalendarIcon, ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ThemeToggle } from "./ui/ThemeToggle";

interface NavbarProps {
  hasSelectedMaterias: boolean;
  onExportPng: () => void;
  onExportIcs: () => void;
}

export default function Navbar({
  hasSelectedMaterias,
  onExportPng,
  onExportIcs,
}: NavbarProps) {
  return (
    <header className="z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">
            Horarios UTN
          </h1>
        </div>

        <nav className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" disabled={!hasSelectedMaterias}>
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={onExportPng}
                disabled={!hasSelectedMaterias}
              >
                <ImageIcon />
                PNG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onExportIcs}
                disabled={!hasSelectedMaterias}
              >
                <CalendarIcon />
                ICS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
