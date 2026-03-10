import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";
import { Consulta } from "@/types/Consulta";
import { useMaterias } from "./useMaterias";

export const useConsultasFiltered = () => {
  const { fetchMateriaByName } = useMaterias();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const trim = (t: string | null) =>
    t ? (t.length > 5 ? t.substring(0, 5) : t) : "";

  const fetchConsultas = useCallback(
    async (
      strategy: "byProfesor" | "byMateria",
      profesorNombre?: string | null,
      materiaId?: number | null,
    ) => {
      try {
        setLoading(true);
        setError(null);
        //   type Row = {
        //     profesor_nombre: string;
        //     materia_id: number | null;
        //     materia: { nombre: string | null; abreviatura: string | null } | null;
        //     profesor: { nombre: string; email: string | null };
        //     dia: { nombre: string };
        //     horaDesde: string;
        //     horaHasta: string;
        //     nota: string;
        //     zoom_url: string;
        //   };

        if (strategy === "byProfesor") {
          if (!profesorNombre)
            throw new Error(
              "[ERROR] Se necesita el nombre del profesor para obtener las consultas",
            );

          const { data: rows, error: rowsErr } = await supabase
            .from("consulta_profe_materia")
            .select(
              "profesor_nombre, profesor(email), materia_id, materia(nombre, abreviatura), dia(nombre),horaDesde, horaHasta, nota, zoom_url",
            )
            .eq("profesor_nombre", profesorNombre);
          if (rowsErr) throw rowsErr;

          const consultas: Consulta[] = (rows ?? []).map(
            (r) =>
              ({
                profesor: {
                  nombre: r.profesor_nombre,
                  email: r.profesor.email,
                },
                materia: r.materia?.nombre ?? "",
                dia: r.dia.nombre ?? "",
                horaDesde: trim(r.horaDesde),
                horaHasta: trim(r.horaHasta),
                nota: r.nota,
                zoomUrl: r.zoom_url,
              }) as Consulta,
          );
          setConsultas(consultas);
        } else {
          if (!materiaId)
            throw new Error(
              "[ERROR] Se necesita el id de la materia para obtener las consultas",
            );

          const { data: rows, error: rowsErr } = await supabase
            .from("consulta_profe_materia")
            .select(
              "profesor_nombre, profesor(email), materia_id, materia(nombre, abreviatura), dia(nombre),horaDesde, horaHasta, nota, zoom_url",
            )
            .eq("materia_id", materiaId);
          if (rowsErr) throw rowsErr;

          const consultas: Consulta[] = (rows ?? []).map(
            (r) =>
              ({
                profesor: {
                  nombre: r.profesor_nombre,
                  email: r.profesor.email,
                },
                materia: r.materia?.nombre ?? "",
                dia: r.dia.nombre ?? "",
                horaDesde: trim(r.horaDesde),
                horaHasta: trim(r.horaHasta),
                nota: r.nota,
                zoomUrl: r.zoom_url,
              }) as Consulta,
          );

          setConsultas(consultas);
        }
      } catch {
        setError("Error al buscar materias");
        setConsultas([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchConsultasByMateriaNombre = useCallback(
    async (nombre: string) => {
      setLoading(true);
      setError(null);
      try {
        const materia = await fetchMateriaByName(nombre);
        if (!materia) {
          setError("Materia no encontrada");
          setConsultas([]);
          return;
        }
        await fetchConsultas("byMateria", null, materia.id);
      } catch {
        setError("Error al buscar consultas");
        setConsultas([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchMateriaByName, fetchConsultas],
  );

  return {
    consultas,
    fetchConsultas,
    fetchConsultasByMateriaNombre,
    loading,
    error,
  };
};
