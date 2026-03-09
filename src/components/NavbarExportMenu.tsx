import { CropIcon, ImageIcon, Share } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavbarExportMenuProps {
  hasSelectedMaterias: boolean;
  onExportPng: (strategy: string) => void;
}

export default function NavbarExportMenu({
  hasSelectedMaterias,
  onExportPng,
}: NavbarExportMenuProps) {
  return (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
