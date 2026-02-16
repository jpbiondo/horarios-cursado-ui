import { CalendarSearch } from "lucide-react";
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
        className="fixed bottom-16 right-2 z-30 lg:hidden"
        aria-label="Buscar Materias"
        onClick={() => onOpenChange(true)}
      >
        <CalendarSearch className="size-5" />
      </Button>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right">
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
