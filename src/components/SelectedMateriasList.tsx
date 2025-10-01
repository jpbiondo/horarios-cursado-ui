import { Clock, Delete, Plus } from "lucide-react";
import { formatCompactSchedule } from "../lib/utils";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";

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
      <div className="text-center py-8">
        <div className="text-base-content/50 mb-2">
          <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-base-content/70 mb-1">
          No hay materias seleccionadas
        </h3>
        <p className="text-base-content/50 text-sm">
          Utiliza el menú lateral para buscar y agregar materias a tu horario
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-base-content">
          Materias seleccionadas
        </h2>
        <div className="badge badge-primary badge-lg">
          {selectedMaterias.length}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {selectedMaterias.map((carreraMateria) => (
          <div
            key={carreraMateria.materiaNombre}
            className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="card-body p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="mb-2">
                    <h3 className="font-semibold text-sm text-base-content mb-2">
                      <span className="badge badge-outline badge-sm mr-2">
                        {carreraMateria.comisionNombre}
                      </span>
                      {carreraMateria.materiaNombre}
                    </h3>
                  </div>
                  <div className="flex items-start gap-1 text-xs text-base-content/70">
                    <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight whitespace-pre-line">
                      {formatCompactSchedule(carreraMateria.horarios)}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-error btn-sm btn-circle"
                  onClick={() => handleDeleteMateria(carreraMateria)}
                  title="Eliminar materia"
                >
                  <Delete className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
