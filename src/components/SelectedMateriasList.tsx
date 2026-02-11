import { Trash, X } from "lucide-react";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
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
    <div className="w-full bg-accent p-2 flex flex-wrap items-center gap-2 min-h-12">
      <span className="text-sm tracking-wide font-semibold uppercase">
        Materias Seleccionadas
      </span>
      {selectedMaterias.length === 0 ? (
        <span className="text-sm text-muted-foreground">
          No hay materias seleccionadas
        </span>
      ) : (
        selectedMaterias.map((materia) => (
          <Badge
            key={`${materia.comisionNombre}-${materia.materiaNombre}`}
            variant="outline"
            className="justify-between p-2 items-center"
          >
            {materia.comisionNombre} - {materia.materiaNombre}{" "}
            <span className="pointer-events-auto">
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleDeleteMateria(materia)}
              />
            </span>
          </Badge>
        ))
      )}
      {selectedMaterias.length > 0 && (
        <Button variant="destructive" onClick={handleDeleteAllMaterias}>
          <Trash />
          Eliminar todo
        </Button>
      )}
    </div>
  );
}
