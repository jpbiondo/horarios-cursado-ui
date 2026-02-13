import { Trash, X } from "lucide-react";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { getMateriaColor, MATERIA_COLOR_CLASSES } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface SelectedMateriaListProps {
  selectedMaterias: MateriaByComisionDTO[];
  popFromMateriasSeleccionadas: (materia: MateriaByComisionDTO) => void;
  deleteAllMateriasSeleccionadas: () => void;
}
export default function SelectedMateriasList({
  selectedMaterias,
  popFromMateriasSeleccionadas,
  deleteAllMateriasSeleccionadas,
}: SelectedMateriaListProps) {
  const handleDeleteMateria = (materia: MateriaByComisionDTO) => {
    popFromMateriasSeleccionadas(materia);
  };

  const handleDeleteAllMaterias = () => {
    deleteAllMateriasSeleccionadas();
  };

  return (
    <div className="flex-shrink-0 z-20 w-full bg-accent p-2 flex flex-wrap items-center gap-2 min-h-12">
      {selectedMaterias.length === 0 ? (
        <span className="text-sm text-muted-foreground">
          No hay materias seleccionadas
        </span>
      ) : (
        selectedMaterias.map((materia) => {
          const colorKey = getMateriaColor(
            selectedMaterias,
            materia.materiaNombre,
            materia.comisionNombre,
          );
          const colorClass = MATERIA_COLOR_CLASSES[colorKey] ?? "";
          return (
            <Badge
              key={`${materia.comisionNombre}-${materia.materiaNombre}`}
              variant="outline"
              className={`justify-between p-2 items-center ${colorClass}`}
            >
              {materia.comisionNombre} - {materia.materiaNombre}{" "}
              <span className="pointer-events-auto">
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleDeleteMateria(materia)}
                />
              </span>
            </Badge>
          );
        })
      )}
      {selectedMaterias.length > 0 && (
        <Button
          variant="link"
          className="text-destructive"
          onClick={handleDeleteAllMaterias}
        >
          <Trash />
          Eliminar todo
        </Button>
      )}
    </div>
  );
}
