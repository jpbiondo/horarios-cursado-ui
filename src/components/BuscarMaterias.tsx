import { useEffect, useState } from "react";
import { Clock, Plus, Search } from "lucide-react";
import { useCarreras } from "../hooks/useCarreras";
import { usePlanes } from "../hooks/usePlanes";
import { useComisiones } from "../hooks/useComisiones";
import { useCarreraMateriasFilteredByComision } from "../hooks/useCarreraMateriasFilteredByComision";
import { formatCompactSchedule, haySuperposicionHorarios } from "../lib/utils";
import { CarreraFindAllDTO } from "../types/CarreraFindAllDTO";
import { ComisionFindAllDTO } from "../types/ComisionFindAllDTO";
import { PlanFindAllDTO } from "../types/PlanFindAllDTO";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export interface BuscarMateriasProps {
  selectedMaterias: MateriaByComisionDTO[];
  pushToMateriasSeleccionadas: (nuevaMateria: MateriaByComisionDTO) => void;
  variant?: "card" | "inline";
}

export default function BuscarMaterias({
  selectedMaterias,
  pushToMateriasSeleccionadas,
  variant = "card",
}: BuscarMateriasProps) {
  const [materiasSeleccionables, setMateriasSeleccionables] =
    useState<MateriaByComisionDTO[]>();
  const [selectedCarrera, setSelectedCarrera] = useState<CarreraFindAllDTO>();
  const [selectedPlan, setSelectedPlan] = useState<PlanFindAllDTO>();
  const [selectedComision, setSelectedComision] =
    useState<ComisionFindAllDTO>();

  const { carreras, fetchCarreras, loading } = useCarreras();
  const { planes, fetchPlanes } = usePlanes();
  const { comisiones, fetchComisiones } = useComisiones();
  const { carreraMaterias, fetchCarreraMaterias } =
    useCarreraMateriasFilteredByComision();

  useEffect(() => {
    fetchCarreras();
  }, []);

  useEffect(() => {
    if (!carreraMaterias) return;
    setMateriasSeleccionables(carreraMaterias);
  }, [carreraMaterias]);

  const handleValueChangeCarrera = (carreraValue: string) => {
    const selectedCarreraId = Number(carreraValue);
    setSelectedCarrera(
      carreras?.filter((carrera) => carrera.id == selectedCarreraId)[0],
    );
    fetchPlanes(selectedCarreraId);
  };

  const handleValueChangePlan = (planValue: string) => {
    const selectedPlanId = Number(planValue);
    setSelectedPlan(planes?.filter((plan) => plan.id === selectedPlanId)[0]);
    fetchComisiones(selectedPlanId);
  };

  const handleValueChangeComision = (comisionValue: string) => {
    const selectedComisionId = Number(comisionValue);
    setSelectedComision(
      comisiones?.filter((comision) => comision.id == selectedComisionId)[0],
    );
  };

  const handleClickSearch = () => {
    if (!selectedComision) return;
    fetchCarreraMaterias(selectedComision.id);
  };

  const handleAddCarreraMateria = (carreraMateria: MateriaByComisionDTO) => {
    if (haySuperposicionHorarios(carreraMateria, selectedMaterias)) {
      toast.error(
        `No se puede añadir ${carreraMateria.materiaNombre}: su horario se superpone más de 45 minutos con otras materias seleccionadas`,
      );
      return;
    }
    pushToMateriasSeleccionadas(carreraMateria);
  };

  const materiaYaSeleccionada = (
    materiaSeleccionable: MateriaByComisionDTO,
    selectedMaterias: MateriaByComisionDTO[],
  ) => {
    if (selectedMaterias.length === 0) return false;

    return (
      selectedMaterias.find(
        (materia) =>
          materia.comisionNombre === materiaSeleccionable.comisionNombre &&
          materia.materiaNombre === materiaSeleccionable.materiaNombre,
      ) !== undefined
    );
  };

  const formContent = (
    <div className=" py-4 space-y-6">
      <div className="px-4 space-y-6">
        <div className="grid gap-3">
          <Label>Carrera</Label>
          <Select
            name="selectedCarrera"
            disabled={loading}
            onValueChange={handleValueChangeCarrera}
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
          <Label>Planes</Label>
          <Select
            name="selectedPlan"
            disabled={loading}
            onValueChange={handleValueChangePlan}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un plan" />
            </SelectTrigger>
            <SelectContent>
              {planes?.map((plan) => (
                <SelectItem key={plan.id} value={String(plan.id)}>
                  {plan.nombre}
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
                <SelectItem key={comision.id} value={String(comision.id)}>
                  {comision.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex flex-col">
          <Button
            variant="default"
            disabled={!selectedCarrera || !selectedPlan || !selectedComision}
            onClick={handleClickSearch}
          >
            <Search />
            Buscar materias
          </Button>
        </div>
      </div>

      {materiasSeleccionables && materiasSeleccionables.length > 0 && (
        <div className="px-1">
          <h3 className={"px-3 mb-3 text-md font-semibold leading-none"}>
            Materias disponibles
          </h3>
          <div className="max-h-[230px] overflow-auto">
            {materiasSeleccionables.map((carreraMateria) => {
              const yaSeleccionada = materiaYaSeleccionada(
                carreraMateria,
                selectedMaterias,
              );
              console.log(yaSeleccionada);
              return (
                <Card
                  key={carreraMateria.materiaNombre}
                  className="py-4 gap-0 border-border mb-3 disabled"
                >
                  <CardHeader className="px-4">
                    <Badge variant="outline">
                      {carreraMateria.comisionNombre}
                    </Badge>
                    <CardTitle className="text-sm flex flex-col">
                      <span>{carreraMateria.materiaNombre}</span>
                    </CardTitle>
                    <CardAction>
                      <Button
                        onClick={() => handleAddCarreraMateria(carreraMateria)}
                        variant="default"
                        className="rounded-full"
                        size="icon-lg"
                        disabled={yaSeleccionada}
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
                    {yaSeleccionada && (
                      <span className="text-xs text-muted-foreground italic">
                        Ya seleccionada
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "card") {
    return (
      <Card className="border-border rounded-none max-w-64 hidden lg:block">
        <CardHeader className="px-4">
          <CardTitle>Buscar materias</CardTitle>
          <CardDescription>
            Busca materias para añadir al calendario
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">{formContent}</CardContent>
      </Card>
    );
  }

  return <div className="flex-1 overflow-y-auto px-4">{formContent}</div>;
}
