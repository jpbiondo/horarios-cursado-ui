import { CalendarSearch } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import BuscarConsultas from "./BuscarConsultas";
import { Consulta } from "@/types/Consulta";
import { Dispatch, SetStateAction } from "react";

interface BuscarConsultasSidebarProps {
  setSelectedConsultas: Dispatch<SetStateAction<Consulta[]>>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BuscarConsultasSidebar({
  setSelectedConsultas,
  open,
  onOpenChange,
}: BuscarConsultasSidebarProps) {
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
            <SheetTitle>Buscar consultas</SheetTitle>
            <SheetDescription>
              Selecciona tu profesor o materia sus horarios de consulta
            </SheetDescription>
          </SheetHeader>
          <BuscarConsultas
            variant="inline"
            setSelectedConsultas={setSelectedConsultas}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
