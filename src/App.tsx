import { useMemo, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import ProfileSwitcher from "./components/ProfileSwitcher";
import BuscarMateriasSidebar from "./components/ui/BuscarMateriasSidebar";
import BuscarMaterias from "./components/BuscarMaterias";
import WeeklySchedule from "./components/WeeklySchedule";
import SelectedMateriasList from "./components/SelectedMateriasList";
import { toPng } from "html-to-image";
import { buildIcsFromMaterias } from "./lib/utils";
import { useProfiles } from "./hooks/useProfiles";
function App() {
  const {
    profiles,
    activeProfile,
    materiasSeleccionadas,
    pushToMateriasSeleccionadas,
    popFromMateriasSeleccionadas,
    deleteAllMateriasSeleccionadas,
    setActiveProfile,
    createProfile,
    renameProfile,
    duplicateProfile,
    deleteProfile,
  } = useProfiles();
  const exportScheduleRef = useRef<HTMLDivElement | null>(null);

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

  const handleExportPng = async () => {
    if (!hasSelectedMaterias) return;
    if (!exportScheduleRef.current) return;
    try {
      const dataUrl = await toPng(exportScheduleRef.current, {
        cacheBust: true,
        backgroundColor: "#FFFFFF",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "horario-semanal.png";
      link.click();
    } catch (error) {
      console.error("Error exporting PNG", error);
    }
  };

  const handleExportIcs = () => {
    if (!hasSelectedMaterias) return;

    const SEMESTER_START = new Date(2026, 1, 1);
    const icsContent = buildIcsFromMaterias(
      materiasSeleccionadas,
      SEMESTER_START,
    );

    if (!icsContent) return;

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "horario-utn.ics";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-base-200 h-screen flex flex-col overflow-hidden relative">
      <Navbar
        hasSelectedMaterias={hasSelectedMaterias}
        onExportPng={handleExportPng}
        onExportIcs={handleExportIcs}
        profileSwitcher={
          <ProfileSwitcher
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectProfile={setActiveProfile}
            onCreateProfile={createProfile}
            onRenameProfile={renameProfile}
            onDuplicateProfile={duplicateProfile}
            onDeleteProfile={deleteProfile}
          />
        }
      />

      <BuscarMateriasSidebar
        selectedMaterias={materiasSeleccionadas}
        pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <main className="w-full max-w-full mx-auto flex-1 min-h-0 flex flex-col relative">
        <div className="flex-1 min-h-0 flex flex-row gap-0 overflow-hidden w-full">
          <div className="flex-1 relative min-h-0 overflow-y-auto overflow-x-auto">
            <WeeklySchedule
              selectedMaterias={materiasSeleccionadas}
              heightInRem={3}
            />
            <div className="sticky bottom-0 z-10 w-full border-t border-border">
              <SelectedMateriasList
                selectedMaterias={materiasSeleccionadas}
                popFromMateriasSeleccionadas={popFromMateriasSeleccionadas}
                deleteAllMateriasSeleccionadas={deleteAllMateriasSeleccionadas}
              />
            </div>
          </div>
          <aside className="w-80 min-w-80 flex-shrink-0  flex-col border-r border-border bg-background overflow-hidden hidden lg:flex">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-md font-semibold">Buscar materias</h2>
              <p className="text-sm text-muted-foreground">
                Busca materias para añadir al calendario
              </p>
            </div>
            <BuscarMaterias
              variant="inline"
              selectedMaterias={materiasSeleccionadas}
              pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
            />
          </aside>
        </div>
        {/* Off-screen WeeklySchedule for PNG export (print-friendly) */}
        {hasSelectedMaterias && (
          <div className="absolute -left-[99999px] top-0">
            <WeeklySchedule
              selectedMaterias={materiasSeleccionadas}
              containerRef={exportScheduleRef}
              hideCurrentTimeIndicator
              hideTodayHighlight
              startHourOverride={exportStartHour}
              heightInRem={3}
            />
          </div>
        )}
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
