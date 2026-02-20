import { useState } from "react";
import { CURRENT_SEMESTRE_ID, YEARLY_SEMESTER_ID } from "../constants";
import { supabase } from "../lib/supabase";
import type { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import type { CarreraMateriaComisionHorario } from "../types/Carrera";

function toHorario(h: {
  hora_inicio: string | null;
  hora_fin: string | null;
  dia: { nombre: string } | null;
}): CarreraMateriaComisionHorario {
  const trim = (t: string | null) =>
    t ? (t.length > 5 ? t.substring(0, 5) : t) : "";
  return {
    dia: h.dia?.nombre ?? "",
    horaDesde: trim(h.hora_inicio) || "00:00",
    horaHasta: trim(h.hora_fin) || "00:00",
  };
}

export const useCarreraMateriasFiltered = () => {
  const [carreraMaterias, setCarreraMaterias] =
    useState<MateriaByComisionDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCarreraMaterias = async (
    strategy: "byComision" | "byMateria",
    planId: number,
    comisionId?: number,
    materiaId?: number,
  ) => {
    try {
      setLoading(true);
      setError(null);

      type Row = {
        id: number;
        materia_id: number | null;
        materia: { nombre: string | null; abreviatura: string | null } | null;
        carrera_plan_comision: { nombre: string | null } | null;
        carrera_plan_comision_materia_horario: {
          hora_inicio: string | null;
          hora_fin: string | null;
          dia: { nombre: string } | null;
        }[];
      };

      if (strategy === "byComision") {
        const { data: rows, error: rowsErr } = await supabase
          .from("carrera_plan_comision_materia")
          .select(
            "id, materia_id, materia(nombre, abreviatura), carrera_plan_comision(nombre), carrera_plan_comision_materia_horario(hora_inicio, hora_fin, dia(nombre))",
          )
          .eq("carrera_plan_comision_id", comisionId!)
          .eq("carrera_plan_id", planId)
          .or(
            `semestre_id.eq.${CURRENT_SEMESTRE_ID},semestre_id.eq.${YEARLY_SEMESTER_ID}`,
          );
        console.log(rowsErr);
        if (rowsErr) throw rowsErr;
        const dtos: MateriaByComisionDTO[] = (rows ?? []).map((r: Row) => ({
          comisionNombre: r.carrera_plan_comision?.nombre ?? "",
          materiaNombre: r.materia?.nombre ?? "",
          materiaNombreAbrev: r.materia?.abreviatura ?? "",
          horarios: (r.carrera_plan_comision_materia_horario ?? []).map(
            toHorario,
          ),
        }));
        setCarreraMaterias(dtos);
      } else {
        const { data: rows, error: rowsErr } = await supabase
          .from("carrera_plan_comision_materia")
          .select(
            "id, materia_id, materia(nombre, abreviatura), carrera_plan_comision(nombre), carrera_plan_comision_materia_horario(hora_inicio, hora_fin, dia(nombre))",
          )
          .eq("materia_id", materiaId!)
          .eq("carrera_plan_id", planId)
          .or(
            `semestre_id.eq.${CURRENT_SEMESTRE_ID},semestre_id.eq.${YEARLY_SEMESTER_ID}`,
          );

        console.log(rowsErr);
        if (rowsErr) throw rowsErr;
        const dtos: MateriaByComisionDTO[] = (rows ?? []).map((r: Row) => ({
          comisionNombre: r.carrera_plan_comision?.nombre ?? "",
          materiaNombre: r.materia?.nombre ?? "",
          materiaNombreAbrev: r.materia?.abreviatura ?? "",
          horarios: (r.carrera_plan_comision_materia_horario ?? []).map(
            toHorario,
          ),
        }));
        setCarreraMaterias(dtos);
      }
    } catch {
      setError("Error al buscar materias");
      setCarreraMaterias([]);
    } finally {
      setLoading(false);
    }
  };

  return { carreraMaterias, fetchCarreraMaterias, loading, error };
};
