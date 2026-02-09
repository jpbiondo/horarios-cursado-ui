import { useState } from "react";
import { supabase } from "../lib/supabase";
import type { ComisionFindAllDTO } from "../types/ComisionFindAllDTO";

export const useComisiones = (carreraId?: number) => {
  const [comisiones, setComisiones] = useState<ComisionFindAllDTO[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComisiones = async (id?: number) => {
    const cid = id ?? carreraId;
    setLoading(true);
    setError(null);
    try {
      if (cid === undefined) {
        setComisiones([]);
        return;
      }
      const { data: plans, error: plansErr } = await supabase
        .from("carrera_plan")
        .select("id")
        .eq("carrera_id", cid);
      if (plansErr) throw plansErr;
      const planIds = (plans ?? []).map((p: { id: number }) => p.id);
      if (planIds.length === 0) {
        setComisiones([]);
        return;
      }
      const { data, error: err } = await supabase
        .from("carrera_plan_comision")
        .select("id, nombre")
        .in("carrera_plan_id", planIds);
      if (err) throw err;
      setComisiones((data ?? []) as ComisionFindAllDTO[]);
    } catch {
      setError("Error fetching comisiones");
    } finally {
      setLoading(false);
    }
  };

  return { comisiones, fetchComisiones, loading, error };
};
