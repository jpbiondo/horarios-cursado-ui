import { useEffect, useState } from "react";
import { Clock, Loader2, Plus, Search } from "lucide-react";
import { useCarreras } from "../hooks/useCarreras";
import { usePlanes } from "../hooks/usePlanes";
import { useComisiones } from "../hooks/useComisiones";
import { useCarreraMateriasFiltered } from "../hooks/useCarreraMateriasFiltered";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MateriaFindAllDTO } from "@/types/MateriaFindAllDTO";
import { useMaterias } from "@/hooks/useMaterias";

export interface BuscarMateriasProps {
  selectedMaterias: MateriaByComisionDTO[];
  pushToMateriasSeleccionadas: (nuevaMateria: MateriaByComisionDTO) => void;
  variant?: "card" | "inline";
}

type FilterValues = "byComision" | "byMateria";

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
    useState<ComisionFindAllDTO | null>(null);
  const [selectedMateria, setSelectedMateria] =
    useState<MateriaFindAllDTO | null>(null);

  const [activeTab, setActiveTab] = useState<FilterValues>("byComision");

  const { carreras, fetchCarreras, loading, error: carrerasError } =
    useCarreras();
  const { planes, fetchPlanes, error: planesError } = usePlanes();
  const { comisiones, fetchComisiones, error: comisionesError } =
    useComisiones();
  const { materias, fetchMaterias, error: materiasError } = useMaterias();
  const {
    carreraMaterias,
    fetchCarreraMaterias,
    loading: searchLoading,
    error: searchError,
  } = useCarreraMateriasFiltered();

  useEffect(() => {
    const err =
      carrerasError ??
      planesError ??
      comisionesError ??
      materiasError ??
      searchError;
    if (err) toast.error(err);
  }, [
    carrerasError,
    planesError,
    comisionesError,
    materiasError,
    searchError,
  ]);

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

    if (activeTab === "byComision") {
      fetchComisiones(selectedPlanId);
      return;
    }

    fetchMaterias(selectedPlanId);
  };

  const handleValueChangeComision = (comisionValue: string) => {
    const selectedComisionId = Number(comisionValue);
    setSelectedComision(
      comisiones?.filter((comision) => comision.id === selectedComisionId)[0] ||
        null,
    );
  };

  const handleValueChangeMateria = (materiaValue: string) => {
    const selectedMateriaId = Number(materiaValue);
    setSelectedMateria(
      materias?.filter((materia) => materia.id === selectedMateriaId)[0] ||
        null,
    );
  };

  const handleClickSearch = () => {
    if (!selectedPlan) return;
    if (activeTab === "byComision") {
      if (!selectedComision) return;
      fetchCarreraMaterias(activeTab, selectedPlan?.id, selectedComision.id);
      return;
    }

    if (!selectedMateria) return;
    fetchCarreraMaterias(
      activeTab,
      selectedPlan?.id,
      undefined,
      selectedMateria.id,
    );
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

  const handleFiltradoChange = (value: string) => {
    setActiveTab(value as FilterValues);
    setSelectedMateria(null);
    setSelectedComision(null);

    const selectedPlanId = selectedPlan?.id;

    if (!value || !selectedPlanId) return;

    if (value === "byComision") {
      fetchComisiones(selectedPlanId);
      return;
    }

    fetchMaterias(selectedPlanId);
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
    <div className="pt-4 space-y-6 flex flex-col flex-1 min-h-0">
      <div className="px-2 space-y-6 flex-shrink-0">
        <div className="grid gap-3">
          <Label>Carrera</Label>
          <Select
            name="selectedCarrera"
            disabled={loading}
            onValueChange={handleValueChangeCarrera}
          >
            <SelectTrigger className="w-full truncate">
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
            <SelectTrigger className="w-full truncate">
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
        <Tabs
          value={activeTab}
          className="grid gap-3"
          onValueChange={handleFiltradoChange}
        >
          <TabsList className="w-full">
            <TabsTrigger value="byComision">Por Comisión</TabsTrigger>
            <TabsTrigger value="byMateria">Por Materia</TabsTrigger>
          </TabsList>
          <TabsContent value="byComision">
            <div className="grid gap-3">
              <Label>Comisiones</Label>
              <Select
                name="selectedComision"
                onValueChange={handleValueChangeComision}
              >
                <SelectTrigger className="w-full truncate">
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
          </TabsContent>
          <TabsContent value="byMateria">
            <div className="grid gap-3">
              <Label>Materias</Label>
              <Select
                name="selectedMateria"
                onValueChange={handleValueChangeMateria}
              >
                <SelectTrigger className="w-full truncate">
                  <SelectValue placeholder="Seleccione una materia" />
                </SelectTrigger>
                <SelectContent>
                  {materias?.map((materia) => (
                    <SelectItem key={materia.id} value={String(materia.id)}>
                      {materia.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          variant="default"
          disabled={
            !selectedCarrera ||
            !selectedPlan ||
            searchLoading ||
            (activeTab === "byComision" ? !selectedComision : !selectedMateria)
          }
          onClick={handleClickSearch}
        >
          {searchLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search />
          )}
          Buscar materias
        </Button>
      </div>

      {materiasSeleccionables && materiasSeleccionables.length > 0 && (
        <div className="px-1 flex-1 min-h-0 flex flex-col">
          <h3 className="px-3 mb-3 text-md font-semibold leading-none flex-shrink-0">
            Materias disponibles
          </h3>
          <div className="flex-1 min-h-0 overflow-auto">
            {materiasSeleccionables.map((carreraMateria) => {
              const yaSeleccionada = materiaYaSeleccionada(
                carreraMateria,
                selectedMaterias,
              );
              return (
                <Card
                  key={`${carreraMateria.comisionNombre}-${carreraMateria.materiaNombre}`}
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
      <Card className="border-border rounded-none max-w-64 max-h-[53.5rem] hidden lg:flex flex-col">
        <CardHeader className="px-4 flex-shrink-0">
          <CardTitle>Buscar materias</CardTitle>
          <CardDescription>
            Busca materias para añadir al calendario
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 flex-1 min-h-0 overflow-hidden flex flex-col">
          {formContent}
        </CardContent>
      </Card>
    );
  }

  return <div className="flex-1 overflow-y-auto px-4">{formContent}</div>;
}
