import { SEMESTER_END } from "@/constants";
import { MateriaByComisionDTO } from "@/types/MateriaByComisionDTO";
import { Profile } from "@/types/Profile";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "horarios-profiles";

function loadProfiles(): {
  profiles: Profile[];
  activeProfileId: string | null;
  hadRecoveryError?: boolean;
  hadSemesterExpired?: boolean;
} {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    const semesterEndMs = SEMESTER_END.getTime();

    if (stored) {
      const parsed = JSON.parse(stored) as {
        profiles: Profile[];
        activeProfileId: string | null;
      };
      if (Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
        if (now > semesterEndMs) {
          localStorage.removeItem(STORAGE_KEY);
          return createDefaultState({ hadSemesterExpired: true });
        }
        return {
          profiles: parsed.profiles,
          activeProfileId: parsed.activeProfileId ?? parsed.profiles[0].id,
        };
      }
    }

    return createDefaultState();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return createDefaultState({ hadRecoveryError: true });
  }
}

function createDefaultState(flags?: {
  hadRecoveryError?: boolean;
  hadSemesterExpired?: boolean;
}): {
  profiles: Profile[];
  activeProfileId: string | null;
  hadRecoveryError?: boolean;
  hadSemesterExpired?: boolean;
} {
  const defaultProfile: Profile = {
    id: crypto.randomUUID(),
    name: "Predeterminado",
    materias: [],
    createdAt: Date.now(),
  };
  return {
    profiles: [defaultProfile],
    activeProfileId: defaultProfile.id,
    ...flags,
  };
}

function saveProfiles(
  profiles: Profile[],
  activeProfileId: string | null,
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ profiles, activeProfileId }),
  );
}

export function useProfiles() {
  const [state, setState] = useState(loadProfiles);
  const hasShownRecoveryToast = useRef(false);

  useEffect(() => {
    if (state.hadRecoveryError && !hasShownRecoveryToast.current) {
      hasShownRecoveryToast.current = true;
      toast.warning(
        "Los datos de perfiles se restauraron tras un error. Verifica tu horario.",
      );
    }
  }, [state.hadRecoveryError]);

  useEffect(() => {
    if (state.hadSemesterExpired && !hasShownRecoveryToast.current) {
      hasShownRecoveryToast.current = true;
      toast.info(
        "El semestre ha terminado. Se ha reiniciado tu horario para el nuevo ciclo.",
      );
    }
  }, [state.hadSemesterExpired]);

  const persist = useCallback(
    (profiles: Profile[], activeProfileId: string | null) => {
      saveProfiles(profiles, activeProfileId);
      setState((prev) => ({ ...prev, profiles, activeProfileId }));
    },
    [],
  );

  const activeProfile = useMemo(
    () =>
      state.profiles.find((p) => p.id === state.activeProfileId) ??
      state.profiles[0] ??
      null,
    [state.profiles, state.activeProfileId],
  );

  const materiasSeleccionadas = activeProfile?.materias ?? [];

  const updateActiveProfileMaterias = useCallback(
    (updater: (prev: MateriaByComisionDTO[]) => MateriaByComisionDTO[]) => {
      if (!activeProfile) return;
      const next = updater(activeProfile.materias);
      const profiles = state.profiles.map((p) =>
        p.id === activeProfile.id ? { ...p, materias: next } : p,
      );
      persist(profiles, state.activeProfileId);
    },
    [activeProfile, state.profiles, state.activeProfileId, persist],
  );

  const pushToMateriasSeleccionadas = useCallback(
    (nuevaMateria: MateriaByComisionDTO) => {
      updateActiveProfileMaterias((prev) =>
        prev.length > 0 ? [...prev, nuevaMateria] : [nuevaMateria],
      );
    },
    [updateActiveProfileMaterias],
  );

  const popFromMateriasSeleccionadas = useCallback(
    (materia: MateriaByComisionDTO) => {
      updateActiveProfileMaterias((prev) =>
        prev.filter(
          (m) =>
            m.comisionNombre !== materia.comisionNombre ||
            m.materiaNombre !== materia.materiaNombre,
        ),
      );
    },
    [updateActiveProfileMaterias],
  );

  const deleteAllMateriasSeleccionadas = useCallback(() => {
    updateActiveProfileMaterias(() => []);
  }, [updateActiveProfileMaterias]);

  const setActiveProfile = useCallback(
    (id: string) => {
      if (state.profiles.some((p) => p.id === id)) {
        persist(state.profiles, id);
      }
    },
    [state.profiles, persist],
  );

  const createProfile = useCallback(() => {
    const count = state.profiles.length + 1;
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: `Perfil ${count}`,
      materias: [],
      createdAt: Date.now(),
    };
    persist([...state.profiles, newProfile], newProfile.id);
    return newProfile;
  }, [state.profiles, persist]);

  const deleteProfile = useCallback(
    (id: string) => {
      const filtered = state.profiles.filter((p) => p.id !== id);
      if (filtered.length === 0) {
        const fallback: Profile = {
          id: crypto.randomUUID(),
          name: "Predeterminado",
          materias: [],
          createdAt: Date.now(),
        };
        persist([fallback], fallback.id);
      } else {
        const nextActive =
          state.activeProfileId === id ? filtered[0].id : state.activeProfileId;
        persist(filtered, nextActive);
      }
    },
    [state.profiles, state.activeProfileId, persist],
  );

  const renameProfile = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const profiles = state.profiles.map((p) =>
        p.id === id ? { ...p, name: trimmed } : p,
      );
      persist(profiles, state.activeProfileId);
    },
    [state.profiles, state.activeProfileId, persist],
  );

  const duplicateProfile = useCallback(
    (id: string) => {
      const source = state.profiles.find((p) => p.id === id);
      if (!source) return null;
      const newProfile: Profile = {
        id: crypto.randomUUID(),
        name: `${source.name} (copia)`,
        materias: [...source.materias],
        createdAt: Date.now(),
      };
      persist([...state.profiles, newProfile], newProfile.id);
      return newProfile;
    },
    [state.profiles, persist],
  );

  return {
    profiles: state.profiles,
    activeProfile,
    materiasSeleccionadas,
    pushToMateriasSeleccionadas,
    popFromMateriasSeleccionadas,
    deleteAllMateriasSeleccionadas,
    setActiveProfile,
    createProfile,
    deleteProfile,
    renameProfile,
    duplicateProfile,
  };
}
