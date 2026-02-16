import { useCallback, useEffect, useRef, useState } from "react";
import { Trash, X } from "lucide-react";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { getMateriaColor, MATERIA_COLOR_CLASSES } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface SelectedMateriaListProps {
  selectedMaterias: MateriaByComisionDTO[];
  popFromMateriasSeleccionadas: (materia: MateriaByComisionDTO) => void;
  deleteAllMateriasSeleccionadas: () => void;
}
export default function SelectedMateriasList({
  selectedMaterias,
  popFromMateriasSeleccionadas,
  deleteAllMateriasSeleccionadas,
}: SelectedMateriaListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFadeState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const hasOverflow = scrollWidth > clientWidth;
    setShowLeftFade(hasOverflow && scrollLeft > 2);
    setShowRightFade(
      hasOverflow && scrollLeft < scrollWidth - clientWidth - 2,
    );
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => requestAnimationFrame(updateFadeState);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateFadeState, selectedMaterias]);

  const handleDeleteMateria = (materia: MateriaByComisionDTO) => {
    popFromMateriasSeleccionadas(materia);
  };

  const handleDeleteAllMaterias = () => {
    deleteAllMateriasSeleccionadas();
  };

  return (
    <div className="flex-shrink-0 z-20 w-full flex flex-row items-center bg-accent p-2 min-h-12">
      <div className="relative flex-1 min-w-0">
        <div
          ref={scrollRef}
          onScroll={updateFadeState}
          className="flex flex-row h-full items-center gap-2 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide pb-2"
        >
        {selectedMaterias.length === 0 ? (
          <span className="text-sm text-muted-foreground flex-shrink-0">
            No hay materias seleccionadas
          </span>
        ) : (
          <>
            {selectedMaterias.map((materia) => {
              const colorKey = getMateriaColor(
                selectedMaterias,
                materia.materiaNombre,
                materia.comisionNombre,
              );
              const colorClass = MATERIA_COLOR_CLASSES[colorKey] ?? "";
              return (
                <Badge
                  key={`${materia.comisionNombre}-${materia.materiaNombre}`}
                  variant="outline"
                  className={`flex-shrink-0 justify-between p-2 items-center ${colorClass}`}
                >
                  {materia.comisionNombre} - {materia.materiaNombre}{" "}
                  <button
                    type="button"
                    className="pointer-events-auto ml-1 rounded p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                    aria-label={`Quitar ${materia.materiaNombre} - ${materia.comisionNombre}`}
                    onClick={() => handleDeleteMateria(materia)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            <Button
              variant="link"
              className="text-destructive flex-shrink-0"
              onClick={handleDeleteAllMaterias}
            >
              <Trash />
              Eliminar todo
            </Button>
          </>
        )}
        </div>
        {/* fade indicators on edges */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-accent to-transparent transition-opacity duration-200 ${
            showLeftFade ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-accent to-transparent transition-opacity duration-200 ${
            showRightFade ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
