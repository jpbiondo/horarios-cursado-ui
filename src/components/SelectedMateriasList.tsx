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
    <div className="flex-shrink-0 z-20 w-full flex flex-row items-center bg-accent p-2 min-h-12">
      <div
        className="flex flex-row h-full items-center w-full gap-2 overflow-x-auto overflow-y-hidden scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {selectedMaterias.length === 0 ? (
          <span className="text-sm text-muted-foreground flex-shrink-0">
            No hay materias seleccionadas
          </span>
        ) : (
          <>
            {selectedMaterias.map((materia) => {
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
                  className={`flex-shrink-0 justify-between p-2 items-center ${colorClass}`}
                >
                  {materia.comisionNombre} - {materia.materiaNombre}{" "}
                  <button
                    type="button"
                    className="pointer-events-auto ml-1 rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                    aria-label={`Quitar ${materia.materiaNombre} - ${materia.comisionNombre}`}
                    onClick={() => handleDeleteMateria(materia)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            <Button
              variant="link"
              className="text-destructive flex-shrink-0"
              onClick={handleDeleteAllMaterias}
            >
              <Trash />
              Eliminar todo
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
