import { supabase } from "@/lib/supabase";
import { MateriaFindAllDTO } from "@/types/MateriaFindAllDTO";
import { useState } from "react";

export const useMaterias = () => {
  const [materias, setMaterias] = useState<MateriaFindAllDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterias = async (planId: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!planId) {
        setMaterias([]);
        setError("No se especificó el plan");
        return;
      }
      const { data, error: err } = await supabase
        .from("carrera_plan_materia")
        .select("materia:materia_id(id, nombre)")
        .eq("carrera_plan_id", planId);

      if (err) throw err;
      const materias = (data ?? [])
        .map((row) => row.materia)
        .filter((m): m is { id: number; nombre: string } => m != null);
      setMaterias(materias as MateriaFindAllDTO[]);
    } catch {
      setError("Error al cargar las materias");
    } finally {
      setLoading(false);
    }
  };

  return { materias, fetchMaterias, loading, error };
};
