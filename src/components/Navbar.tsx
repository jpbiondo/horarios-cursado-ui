import { CropIcon, ImageIcon, Share } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ThemeToggle } from "./ui/ThemeToggle";
import logo from "../assets/logo.png";

interface NavbarProps {
  hasSelectedMaterias: boolean;
  onExportPng: (strategy: string) => void;
  onExportIcs?: () => void;
  profileSwitcher?: React.ReactNode;
}

export default function Navbar({
  hasSelectedMaterias,
  onExportPng,
  profileSwitcher,
}: NavbarProps) {
  return (
    <header className="z-10 flex-shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between gap-2 px-1 sm:px-4">
        <div className="flex items-center gap-1">
          <img src={logo} className="block h-14 dark:invert" />
        </div>

        <nav className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {profileSwitcher}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="default"
                disabled={!hasSelectedMaterias}
                aria-label="Exportar horario"
              >
                <Share className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onExportPng("recortado")}
                disabled={!hasSelectedMaterias}
              >
                <CropIcon />
                PNG Recortado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportPng("completo")}
                disabled={!hasSelectedMaterias}
              >
                <ImageIcon />
                PNG Completo
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={onExportIcs}
                disabled={!hasSelectedMaterias}
              >
                <CalendarIcon />
                ICS
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
