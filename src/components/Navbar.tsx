import { CalendarIcon, ChevronDown, ImageIcon } from "lucide-react";
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
  profileSwitcher?: React.ReactNode;
}

export default function Navbar({
  hasSelectedMaterias,
  onExportPng,
  onExportIcs,
  profileSwitcher,
}: NavbarProps) {
  return (
    <header className="z-10 flex-shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <h1 className="truncate text-lg font-semibold text-foreground">
            Horarios UTN
          </h1>
        </div>

        <nav className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant={"outline"}
                disabled={!hasSelectedMaterias}
                aria-label="Exportar horario"
                className="min-w-0 gap-1.5 px-2 sm:px-3 touch-manipulation min-h-10"
              >
                Exportar
                <ChevronDown className="size-4 shrink-0" />
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
          {profileSwitcher}
        </nav>
      </div>
    </header>
  );
}
