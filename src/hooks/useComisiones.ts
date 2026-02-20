import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { ComisionFindAllDTO } from "../types/ComisionFindAllDTO";

export const useComisiones = () => {
  const [comisiones, setComisiones] = useState<ComisionFindAllDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComisiones = async (planId: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!planId) {
        setComisiones([]);
        setError("No se especificó el plan");
        return;
      }
      const { data, error: err } = await supabase
        .from("carrera_plan_comision")
        .select("id, nombre")
        .eq("carrera_plan_id", planId);
      if (err) throw err;
      setComisiones((data ?? []) as ComisionFindAllDTO[]);
    } catch {
      setError("Error al cargar las comisiones");
    } finally {
      setLoading(false);
    }
  };

  return { comisiones, fetchComisiones, loading, error };
};
