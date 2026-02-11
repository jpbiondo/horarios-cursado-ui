import { MateriaByComisionDTO } from "@/types/MateriaByComisionDTO";
import { useCallback, useState } from "react";

export const useMateriasSeleccionadas = () => {
  const MATERIAS_GUARDADAS_KEY = "materiasGuardadas";

  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState<
    MateriaByComisionDTO[]
  >(() => {
    const materiasGuardadas = localStorage.getItem(MATERIAS_GUARDADAS_KEY);
    return materiasGuardadas ? JSON.parse(materiasGuardadas) : [];
  });
  const pushToMateriasSeleccionadas = useCallback(
    (nuevaMateria: MateriaByComisionDTO) => {
      setMateriasSeleccionadas((prev) => {
        const newSelectedMaterias =
          prev.length > 0 ? [...prev, nuevaMateria] : [nuevaMateria];

        localStorage.setItem(
          MATERIAS_GUARDADAS_KEY,
          JSON.stringify(newSelectedMaterias),
        );
        return newSelectedMaterias;
      });
    },
    [setMateriasSeleccionadas],
  );

  const popFromMateriasSeleccionadas = useCallback(
    (materia: MateriaByComisionDTO) => {
      setMateriasSeleccionadas((prev) => {
        const newSelectedMaterias = prev.filter((m) => {
          return (
            m.comisionNombre !== materia.comisionNombre ||
            m.materiaNombre !== materia.materiaNombre
          );
        });

        localStorage.setItem(
          MATERIAS_GUARDADAS_KEY,
          JSON.stringify(newSelectedMaterias),
        );

        return newSelectedMaterias;
      });
    },
    [],
  );
  return {
    materiasSeleccionadas,
    setMateriasSeleccionadas,
    pushToMateriasSeleccionadas,
    popFromMateriasSeleccionadas,
  };
};
