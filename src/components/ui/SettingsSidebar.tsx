import { Settings } from "lucide-react";
import { MateriaByComisionDTO } from "../../types/MateriaByComisionDTO";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import BuscarMaterias from "../BuscarMaterias";

interface SettingsSidebarProps {
  selectedMaterias: MateriaByComisionDTO[];
  setSelectedMaterias: React.Dispatch<
    React.SetStateAction<MateriaByComisionDTO[]>
  >;
}

export default function SettingsSidebar({
  selectedMaterias,
  setSelectedMaterias,
}: SettingsSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-2 right-2 z-20">
        <Button
          className="rounded-full size-12"
          variant="default"
          size="icon-lg"
        >
          <Settings className="size-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]" side="left">
        <SheetHeader>
          <SheetTitle>Buscar materias</SheetTitle>
          <SheetDescription>
            Selecciona tu carrera y comisión para consultar las materias
          </SheetDescription>
        </SheetHeader>
        <BuscarMaterias
          variant="inline"
          selectedMaterias={selectedMaterias}
          setSelectedMaterias={setSelectedMaterias}
        />
      </SheetContent>
    </Sheet>
  );
}
