import { useMemo, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import NavbarExportMenu from "./components/NavbarExportMenu";
import ProfileSwitcher from "./components/ProfileSwitcher";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import BuscarMateriasSidebar from "./components/BuscarMateriasSidebar";
import BuscarMaterias from "./components/BuscarMaterias";
import WeeklySchedule from "./components/WeeklySchedule";
import MobileWeeklySchedule from "./components/MobileWeeklySchedule";
import SelectedMateriasList from "./components/SelectedMateriasList";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { useProfiles } from "./hooks/useProfiles";
import { useTheme } from "next-themes";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router";

function ScheduleEstudiante() {
  const {
    profiles,
    activeProfile,
    materiasSeleccionadas,
    pushToMateriasSeleccionadas,
    pushManyToMateriasSeleccionadas,
    popFromMateriasSeleccionadas,
    deleteAllMateriasSeleccionadas,
    setActiveProfile,
    createProfile,
    renameProfile,
    duplicateProfile,
    deleteProfile,
  } = useProfiles();
  const exportScheduleRefFull = useRef<HTMLDivElement | null>(null);
  const exportScheduleRefCropped = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  const navigate = useNavigate();
  const hasSelectedMaterias = materiasSeleccionadas.length > 0;

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const exportStartHour = useMemo(() => {
    if (!materiasSeleccionadas.length) return undefined;
    const hours: number[] = [];
    materiasSeleccionadas.forEach((materia) => {
      materia.horarios.forEach((horario) => {
        const hour = Number(horario.horaDesde.substring(0, 2));
        if (!Number.isNaN(hour)) {
          hours.push(hour);
        }
      });
    });
    if (!hours.length) return undefined;
    return Math.min(...hours);
  }, [materiasSeleccionadas]);

  const exportOffsetHour = useMemo(() => {
    if (!materiasSeleccionadas.length) return undefined;
    const hours: number[] = [];
    materiasSeleccionadas.forEach((materia) => {
      materia.horarios.forEach((horario) => {
        const hour = Number(horario.horaHasta.substring(0, 2));
        if (!Number.isNaN(hour)) {
          hours.push(hour);
        }
      });
    });
    if (!hours.length) return undefined;
    return Math.max(...hours) + 1 - (exportStartHour ?? 8);
  }, [materiasSeleccionadas, exportStartHour]);

  const handleExportPng = async (strategy: string) => {
    if (!hasSelectedMaterias) return;
    const ref =
      strategy === "completo"
        ? exportScheduleRefFull
        : exportScheduleRefCropped;
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        backgroundColor: resolvedTheme === "light" ? "#FFFFFF" : "#121212",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "horario-semanal.png";
      link.click();
      toast.success("Imagen exportada");
    } catch (error) {
      console.error("Error exporting PNG", error);
      toast.error("Error al exportar la imagen");
    }
  };

  return (
    <div className="app-root bg-base-200 min-h-0 h-full flex flex-col overflow-hidden relative">
      <Navbar
        rightContent={
          <>
            <ThemeToggle />
            <ProfileSwitcher
              profiles={profiles}
              activeProfile={activeProfile}
              onSelectProfile={setActiveProfile}
              onCreateProfile={createProfile}
              onRenameProfile={renameProfile}
              onDuplicateProfile={duplicateProfile}
              onDeleteProfile={deleteProfile}
            />
            <NavbarExportMenu
              hasSelectedMaterias={hasSelectedMaterias}
              onExportPng={handleExportPng}
            />
          </>
        }
      />

      <BuscarMateriasSidebar
        selectedMaterias={materiasSeleccionadas}
        pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
        pushManyToMateriasSeleccionadas={pushManyToMateriasSeleccionadas}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <main className="w-full max-w-full mx-auto flex-1 min-h-0 flex flex-col relative">
        <SelectedMateriasList
          selectedMaterias={materiasSeleccionadas}
          popFromMateriasSeleccionadas={popFromMateriasSeleccionadas}
          deleteAllMateriasSeleccionadas={deleteAllMateriasSeleccionadas}
        />
        <div className="flex-1 min-h-0 flex flex-row gap-0 overflow-hidden w-full">
          <div className="schedule-scroll flex-1 flex flex-col relative min-h-0 overflow-y-auto overflow-x-auto touch-pan-y">
            <div className="hidden md:block flex-1">
              <WeeklySchedule
                selectedMaterias={materiasSeleccionadas}
                heightInRem={3}
              />
            </div>
            <div className="md:hidden px-4 pt-4 flex-1">
              <MobileWeeklySchedule selectedMaterias={materiasSeleccionadas} />
            </div>
            <div className="fixed bottom-0 z-10 w-full border-t border-border"></div>
          </div>
          <aside className="w-80 min-w-80 flex-shrink-0 flex-col border-r border-border bg-background overflow-hidden hidden lg:flex">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-md font-semibold">Buscar materias</h2>
              <p className="text-sm text-muted-foreground">
                Busca materias para añadir al calendario
              </p>
              <Button
                variant="link"
                size="sm"
                className="pl-0 cursor-pointer"
                onClick={() => navigate("/consultas")}
              >
                <span className="text-green-500 font-bold">[NUEVO]</span> Ver
                Consultas
              </Button>
            </div>
            <BuscarMaterias
              variant="inline"
              selectedMaterias={materiasSeleccionadas}
              pushManyToMateriasSeleccionadas={pushManyToMateriasSeleccionadas}
              pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
            />
          </aside>
        </div>
        {/* Off-screen WeeklySchedule for PNG export (print-friendly) */}
        {hasSelectedMaterias && (
          <div className="absolute -left-[99999px] top-0">
            <WeeklySchedule
              selectedMaterias={materiasSeleccionadas}
              containerRef={exportScheduleRefCropped}
              hideCurrentTimeIndicator
              hideTodayHighlight
              startHourOverride={exportStartHour}
              offsetHourOverride={exportOffsetHour}
              heightInRem={3}
            />
          </div>
        )}
        {hasSelectedMaterias && (
          <div className="absolute -left-[99999px] top-0">
            <WeeklySchedule
              selectedMaterias={materiasSeleccionadas}
              containerRef={exportScheduleRefFull}
              hideCurrentTimeIndicator
              hideTodayHighlight
              heightInRem={3}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default ScheduleEstudiante;
