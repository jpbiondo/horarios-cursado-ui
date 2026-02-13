import { Search } from "lucide-react";
import { MateriaByComisionDTO } from "../../types/MateriaByComisionDTO";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import BuscarMaterias from "../BuscarMaterias";

interface BuscarMateriasSidebarProps {
  selectedMaterias: MateriaByComisionDTO[];
  pushToMateriasSeleccionadas: (nuevaMateria: MateriaByComisionDTO) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BuscarMateriasSidebar({
  selectedMaterias,
  pushToMateriasSeleccionadas,
  open,
  onOpenChange,
}: BuscarMateriasSidebarProps) {
  return (
    <>
      <Button
        variant="default"
        size="icon-lg"
        className="fixed bottom-2 right-2 z-20 lg:hidden"
        aria-label="Buscar Materias"
        onClick={() => onOpenChange(true)}
      >
        <Search className="size-4" />
      </Button>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[540px]" side="right">
          <SheetHeader>
            <SheetTitle>Buscar materias</SheetTitle>
            <SheetDescription>
              Selecciona tu carrera y comisión para consultar las materias
            </SheetDescription>
          </SheetHeader>
          <BuscarMaterias
            variant="inline"
            selectedMaterias={selectedMaterias}
            pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
