import { Plus, Search, Settings, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useCarreras } from "../../hooks/useCarreras";
import { useComisiones } from "../../hooks/useComisiones";
import { CarreraFindAllDTO } from "../../types/CarreraFindAllDTO";
import { useCarreraMateriasFilteredByComision } from "../../hooks/useCarreraMateriasFilteredByComision";
import { ComisionFindAllDTO } from "../../types/ComisionFindAllDTO";
import {
  haySuperposicionHorarios,
  formatCompactSchedule,
} from "../../lib/utils";
import { MateriaByComisionDTO } from "../../types/MateriaByComisionDTO";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Label } from "./label";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";

interface SettingsSidebarProps {
  selectedCarrera?: CarreraFindAllDTO;
  setSelectedCarrera: React.Dispatch<
    React.SetStateAction<CarreraFindAllDTO | undefined>
  >;

  selectedComision?: ComisionFindAllDTO;
  setSelectedComision: React.Dispatch<
    React.SetStateAction<ComisionFindAllDTO | undefined>
  >;

  selectedMaterias?: MateriaByComisionDTO[];
  setSelectedMaterias: React.Dispatch<
    React.SetStateAction<MateriaByComisionDTO[] | undefined>
  >;
}
export default function SettingsSidebar({
  selectedCarrera,
  setSelectedCarrera,
  selectedComision,
  setSelectedComision,
  selectedMaterias,
  setSelectedMaterias,
}: SettingsSidebarProps) {
  const [materiasSeleccionables, setMateriasSeleccionables] =
    useState<MateriaByComisionDTO[]>();

  const { carreras, fetchCarreras, loading } = useCarreras();
  const { comisiones, fetchComisiones } = useComisiones();
  const { carreraMaterias, fetchCarreraMaterias } =
    useCarreraMateriasFilteredByComision();

  useEffect(() => {
    fetchCarreras();
  }, []);

  useEffect(() => {
    if (!carreraMaterias) return;
    setMateriasSeleccionables(carreraMaterias);
    console.log(carreraMaterias);
  }, [carreraMaterias]);

  const handleValueChangeCarrera = (carreraValue: string) => {
    const selectedCarreraId: number = Number(carreraValue);

    setSelectedCarrera(
      carreras?.filter((carrera) => carrera.id == selectedCarreraId)[0]
    );

    fetchComisiones(selectedCarrera?.id);
  };

  const handleValueChangeComision = (comisionValue: string) => {
    const selectedComisionNombre: string = comisionValue;

    setSelectedComision(
      comisiones?.filter(
        (comision) => comision.nombre == selectedComisionNombre
      )[0]
    );
  };

  const handleClickSearch = () => {
    if (!selectedComision) return;
    fetchCarreraMaterias(selectedComision.nombre);
  };

  const handleAddCarreraMateria = (carreraMateria: MateriaByComisionDTO) => {
    if (
      selectedMaterias &&
      selectedMaterias?.length > 0 &&
      haySuperposicionHorarios(carreraMateria, selectedMaterias)
    ) {
      console.log("HAY SUPERPOSICION BOLUDO");
    }

    setSelectedMaterias(
      selectedMaterias
        ? [...selectedMaterias, carreraMateria]
        : [carreraMateria]
    );

    const materiasRestantes = materiasSeleccionables?.filter(
      (materia) => materia.materiaNombre != carreraMateria.materiaNombre
    );
    setMateriasSeleccionables(materiasRestantes);
    console.log(selectedMaterias);
  };
  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-1 right-1 z-20">
        <Button className="rounded-full size-12" size="icon-lg">
          <Settings className="size-8 !text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]" side="left">
        <SheetHeader>
          <SheetTitle>Buscar materias</SheetTitle>
          <SheetDescription>
            Selecciona tu carrera y comisión para consultar las materias
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-6 py-4">
            <div className="grid gap-3">
              <Label>Carrera</Label>
              <Select
                name="selectedCarrera"
                onValueChange={handleValueChangeCarrera}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione una carrera" />
                </SelectTrigger>
                <SelectContent>
                  {carreras?.map((carrera) => (
                    <SelectItem key={carrera.id} value={String(carrera.id)}>
                      {carrera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Comisiones</Label>
              <Select
                name="selectedComision"
                onValueChange={handleValueChangeComision}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione una comisión" />
                </SelectTrigger>
                <SelectContent>
                  {comisiones?.map((comision) => (
                    <SelectItem key={comision.id} value={comision.nombre}>
                      {comision.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="default"
              disabled={!selectedCarrera || !selectedComision}
              onClick={handleClickSearch}
            >
              <Search />
              Buscar materias
            </Button>

            {materiasSeleccionables && materiasSeleccionables.length > 0 && (
              <div className="space-y-3">
                <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  Materias disponibles:
                </h3>
                {materiasSeleccionables.map((carreraMateria) => (
                  <Card
                    key={carreraMateria.materiaNombre}
                    className="py-4 gap-0"
                  >
                    <CardHeader className="px-4">
                      <CardTitle className="flex gap-2 items-center">
                        <Badge variant="outline">
                          {carreraMateria.comisionNombre}
                        </Badge>
                        <span>{carreraMateria.materiaNombre}</span>
                      </CardTitle>
                      <CardAction>
                        <Button
                          onClick={() =>
                            handleAddCarreraMateria(carreraMateria)
                          }
                          variant="default"
                          className="rounded-full"
                          size="icon-lg"
                        >
                          <Plus />
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent className="px-4">
                      <div className="flex items-start gap-1 text-xs text-base-content/70">
                        <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-tight whitespace-pre-line">
                          {formatCompactSchedule(carreraMateria.horarios)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
