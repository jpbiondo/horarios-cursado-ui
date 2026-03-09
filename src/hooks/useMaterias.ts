import { supabase } from "@/lib/supabase";
import { MateriaFindAllDTO } from "@/types/MateriaFindAllDTO";
import { useCallback, useState } from "react";

export const useMaterias = () => {
  const [materias, setMaterias] = useState<MateriaFindAllDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMateriasByPlanId = useCallback(async (planId: number) => {
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
        .filter((m): m is { id: number; nombre: string } => m != null)
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
      setMaterias(materias as MateriaFindAllDTO[]);
    } catch {
      setError("Error al cargar las materias");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMaterias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("materia")
        .select("id, nombre");

      if (err) throw err;
      const materias = (data ?? [])
        .filter((m): m is { id: number; nombre: string } => m != null)
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
      setMaterias(materias as MateriaFindAllDTO[]);
    } catch {
      setError("Error al cargar las materias");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMateriaByName = useCallback(
    async (nombre: string): Promise<MateriaFindAllDTO | null> => {
      if (!nombre?.trim()) return null;
      try {
        const { data, error: err } = await supabase
          .from("materia")
          .select("id, nombre")
          .ilike("nombre", nombre.trim())
          .limit(1)
          .maybeSingle();

        if (err) return null;
        if (!data) return null;
        return { id: data.id, nombre: data.nombre ?? "" };
      } catch {
        return null;
      }
    },
    [],
  );

  return {
    materias,
    fetchMateriasByPlanId,
    fetchMaterias,
    fetchMateriaByName,
    loading,
    error,
  };
};
