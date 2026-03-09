import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";
import { Profesor } from "@/types/Profesor";

export const useProfesores = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfesores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("profesor")
        .select("nombre, email");
      if (err) throw err;
      const profesores_data = (data ?? []).sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es"),
      );

      setProfesores(profesores_data as Profesor[]);
    } catch {
      setError("Error al cargar los profesores");
    } finally {
      setLoading(false);
    }
  }, []);

  return { profesores, fetchProfesores, loading, error };
};
