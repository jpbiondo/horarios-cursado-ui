import { useState } from "react";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";

const API_URL = import.meta.env.VITE_API_URL;

export const useCarreraMateriasFilteredByComision = () => {
  const [carreraMaterias, setCarreraMaterias] =
    useState<MateriaByComisionDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCarreraMaterias = async (comision: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/carrera/byComision/${comision}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const materiaByComisionDTOs: MateriaByComisionDTO[] =
        await response.json();
      setCarreraMaterias(materiaByComisionDTOs);
    } catch (error) {
      setError("Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  return { carreraMaterias, fetchCarreraMaterias, loading, error };
};
