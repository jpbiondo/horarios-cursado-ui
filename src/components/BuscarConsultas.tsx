import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useMaterias } from "@/hooks/useMaterias";
import { Profesor } from "@/types/Profesor";
import { useProfesores } from "@/hooks/useProfesores";
import { MateriaFindAllDTO } from "@/types/MateriaFindAllDTO";
import { Consulta } from "@/types/Consulta";

export interface BuscarConsultasProps {
  setSelectedConsultas?: Dispatch<SetStateAction<Consulta[]>>;
  variant?: "card" | "inline";
}

type FilterValues = "byProfesor" | "byMateria";

export default function BuscarConsultas({
  variant = "card",
}: BuscarConsultasProps) {
  const [activeTab, setActiveTab] = useState<FilterValues>("byProfesor");
  const [selectedProfesor, setSelectedProfesor] = useState<Profesor | null>(
    null,
  );
  const [selectedMateria, setSelectedMateria] =
    useState<MateriaFindAllDTO | null>(null);

  const navigate = useNavigate();
  const { materias, fetchMaterias, error: materiasError } = useMaterias();
  const { profesores, fetchProfesores, error: profesorError } = useProfesores();

  useEffect(() => {
    const err = materiasError ?? profesorError;
    if (err) toast.error(err);
  }, [profesorError, materiasError]);

  useEffect(() => {
    if (activeTab === "byProfesor") {
      fetchProfesores();
      return;
    }
    fetchMaterias();
  }, [activeTab, fetchProfesores, fetchMaterias]);

  const handleValueChangeProfesor = (profesorValue: string) => {
    const selectedProfesorNombre = profesorValue;
    setSelectedProfesor(
      profesores?.filter(
        (profesor) => profesor.nombre === selectedProfesorNombre,
      )[0],
    );
  };

  const handleValueChangeMateria = (materiaValue: string) => {
    const selectedMateriaId = Number(materiaValue);
    setSelectedMateria(
      materias?.filter((materia) => materia.id === selectedMateriaId)[0],
    );
  };

  const handleClickSearch = () => {
    if (activeTab === "byProfesor") {
      if (!selectedProfesor) return;
      navigate(
        `/consultas/profesor/${encodeURIComponent(selectedProfesor.nombre)}`,
      );
      return;
    }

    if (!selectedMateria) return;
    navigate(
      `/consultas/materia/${encodeURIComponent(selectedMateria.nombre)}`,
    );
  };

  const handleFiltradoChange = (value: string) => {
    setActiveTab(value as FilterValues);
    setSelectedMateria(null);
    setSelectedProfesor(null);
  };

  const formContent = (
    <div className="pt-4 space-y-6 flex flex-col flex-1 min-h-0">
      <div className="px-2 space-y-6 flex-shrink-0">
        <Tabs
          value={activeTab}
          className="grid gap-3"
          onValueChange={handleFiltradoChange}
        >
          <TabsList className="w-full">
            <TabsTrigger value="byProfesor">Por Profesor</TabsTrigger>
            <TabsTrigger value="byMateria">Por Materia</TabsTrigger>
          </TabsList>
          <TabsContent value="byProfesor">
            <div className="grid gap-3">
              <Label>Profesor</Label>
              <Select
                name="selectedProfesor"
                onValueChange={handleValueChangeProfesor}
              >
                <SelectTrigger className="w-full truncate">
                  <SelectValue placeholder="Seleccione un profesor" />
                </SelectTrigger>
                <SelectContent>
                  {profesores?.map((profesor) => (
                    <SelectItem
                      key={profesor.nombre}
                      value={String(profesor.nombre)}
                    >
                      {profesor.nombre}
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
            activeTab === "byProfesor" ? !selectedProfesor : !selectedMateria
          }
          onClick={handleClickSearch}
        >
          <Search />
          Buscar consultas
        </Button>
      </div>
    </div>
  );

  if (variant === "card") {
    return (
      <Card className="border-border rounded-none max-w-64 max-h-[53.5rem] hidden lg:flex flex-col">
        <CardHeader className="px-4 flex-shrink-0">
          <CardTitle>Buscar consultas</CardTitle>
          <CardDescription>
            Selecciona tu profesor o materia sus horarios de consulta
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
