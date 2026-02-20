import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { CarreraFindAllDTO } from "../types/CarreraFindAllDTO";

export const useCarreras = () => {
  const [carreras, setCarrera] = useState<CarreraFindAllDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCarreras = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.from("carrera").select("id, nombre");
      if (err) throw err;
      setCarrera((data ?? []) as CarreraFindAllDTO[]);
    } catch {
      setError("Error al cargar las carreras");
    } finally {
      setLoading(false);
    }
  };

  return { carreras, fetchCarreras, loading, error };
};
