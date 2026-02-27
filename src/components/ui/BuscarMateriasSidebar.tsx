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
  pushManyToMateriasSeleccionadas: (
    nuevasMaterias: MateriaByComisionDTO[],
  ) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BuscarMateriasSidebar({
  selectedMaterias,
  pushToMateriasSeleccionadas,
  pushManyToMateriasSeleccionadas,
  open,
  onOpenChange,
}: BuscarMateriasSidebarProps) {
  return (
    <>
      <Button
        variant="default"
        size="icon-lg"
        className="fixed bottom-2 right-2 z-30 lg:hidden h-12 w-12"
        aria-label="Buscar Materias"
        onClick={() => onOpenChange(true)}
      >
        <CalendarSearch className="size-5" />
      </Button>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" forceMount={true}>
          <SheetHeader>
            <SheetTitle>Buscar materias</SheetTitle>
            <SheetDescription>
              Selecciona tu carrera y comisión para consultar las materias
            </SheetDescription>
          </SheetHeader>
          <BuscarMaterias
            variant="inline"
            selectedMaterias={selectedMaterias}
            pushManyToMateriasSeleccionadas={pushManyToMateriasSeleccionadas}
            pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
