import { Clock, Plus, Trash } from "lucide-react";
import { formatCompactSchedule } from "../lib/utils";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface SelectedMateriaListProps {
  selectedMaterias?: MateriaByComisionDTO[];
  setSelectedMaterias: React.Dispatch<
    React.SetStateAction<MateriaByComisionDTO[] | undefined>
  >;
}
export default function SelectedMateriasList({
  selectedMaterias,
  setSelectedMaterias,
}: SelectedMateriaListProps) {
  const handleDeleteMateria = (materia: MateriaByComisionDTO) => {
    const nuevoSelectedMaterias = selectedMaterias?.filter(
      (selectedMateria) =>
        selectedMateria.materiaNombre !== materia.materiaNombre
    );
    setSelectedMaterias(nuevoSelectedMaterias);
  };

  if (!selectedMaterias || selectedMaterias.length === 0) {
    return (
      <div className="text-center py-8 space-y-8">
        <div className="text-base-content/50 mb-2">
          <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold mb-1">
          No hay materias seleccionadas
        </h3>
        <p className="text-sm text-primary/70">
          Cuando agregues materias al calendario se mostrarán aquí
        </p>
        <Button size="lg">Agregar materias</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {selectedMaterias.map((carreraMateria) => (
          <Card
            key={carreraMateria.materiaNombre}
            className="py-4 gap-0 border-border"
          >
            <CardHeader className="px-4">
              <CardTitle className="flex gap-2 items-center">
                <Badge variant="outline">{carreraMateria.comisionNombre}</Badge>
                <span>{carreraMateria.materiaNombre}</span>
              </CardTitle>
              <CardAction>
                <Button
                  onClick={() => handleDeleteMateria(carreraMateria)}
                  variant="destructive"
                  className="rounded-full"
                  size="icon-lg"
                >
                  <Trash />
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
    </div>
  );
}
