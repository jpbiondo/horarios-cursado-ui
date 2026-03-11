import { CalendarSearch } from "lucide-react";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import BuscarMaterias from "./BuscarMaterias";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  return (
    <>
      <Button
        variant="default"
        size="icon-lg"
        className="fixed bottom-2 right-2 z-20 lg:hidden h-12 w-12"
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
            <div>
              <Button
                variant="link"
                size="sm"
                className="pl-0 cursor-pointer"
                onClick={() => navigate("/consultas")}
              >
                <span className="text-green-500 font-bold">[NUEVO]</span> Ver
                Consultas
              </Button>
            </div>
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
