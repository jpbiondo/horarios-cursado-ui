import { supabase } from "@/lib/supabase";
import { PlanFindAllDTO } from "@/types/PlanFindAllDTO";
import { useState } from "react";

export const usePlanes = () => {
  const [planes, setPlanes] = useState<PlanFindAllDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanes = async (carreraId: number) => {
    setLoading(true);
    setError(null);

    try {
      if (!carreraId) {
        setPlanes([]);
        setError("No se especificó la carrera");
        return;
      }

      const { data, error: err } = await supabase
        .from("carrera_plan")
        .select("id, nombre")
        .eq("carrera_id", carreraId);
      if (err) throw err;
      setPlanes((data ?? []) as PlanFindAllDTO[]);
    } catch {
      setError("Error al cargar los planes");
    } finally {
      setLoading(false);
    }
  };

  return { planes, fetchPlanes, loading, error };
};
