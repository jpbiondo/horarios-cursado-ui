import { useState } from "react";
import { ComisionFindAllDTO } from "../types/ComisionFindAllDTO";

const API_URL = import.meta.env.VITE_API_URL;

export const useComisiones = (carreraId?: number) => {
  const [comisiones, setComisiones] = useState<ComisionFindAllDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComisiones = async (carreraId?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (carreraId !== undefined) {
        params.append("carreraId", carreraId.toString());
      }
      const response = await fetch(`${API_URL}/comision?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const comisiones = await response.json();
      setComisiones(comisiones);
    } catch (error) {
      setError("Error fetching comisiones");
    } finally {
      setLoading(false);
    }
  };

  return { comisiones, fetchComisiones, loading, error };
};
