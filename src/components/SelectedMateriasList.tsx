import { X } from "lucide-react";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { Badge } from "./ui/badge";

interface SelectedMateriaListProps {
  selectedMaterias: MateriaByComisionDTO[];
  popFromMateriasSeleccionadas: (materia: MateriaByComisionDTO) => void;
}
export default function SelectedMateriasList({
  selectedMaterias,
  popFromMateriasSeleccionadas,
}: SelectedMateriaListProps) {
  const handleDeleteMateria = (materia: MateriaByComisionDTO) => {
    popFromMateriasSeleccionadas(materia);
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
    </div>
  );
}
