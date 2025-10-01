import { useState } from "react";
import { CarreraFindAllDTO } from "../types/CarreraFindAllDTO";

const API_URL = import.meta.env.VITE_API_URL;

export const useCarreras = () => {
  const [carreras, setCarrera] = useState<CarreraFindAllDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCarreras = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/carrera`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const carreras = await response.json();
      setCarrera(carreras);
    } catch (error) {
      setError("Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  return { carreras, fetchCarreras, loading, error };
};
