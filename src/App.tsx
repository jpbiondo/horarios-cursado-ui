import { useMemo, useRef, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import BuscarMateriasSidebar from "./components/ui/BuscarMateriasSidebar";
import BuscarMaterias from "./components/BuscarMaterias";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import DailySchedule from "./components/DailySchedule";
import WeeklySchedule from "./components/WeeklySchedule";
import SelectedMateriasList from "./components/SelectedMateriasList";
import { toPng } from "html-to-image";
import { buildIcsFromMaterias } from "./lib/utils";
import { useMateriasSeleccionadas } from "./hooks/useMateriasSeleccionadas";

function App() {
  const {
    materiasSeleccionadas,
    pushToMateriasSeleccionadas,
    popFromMateriasSeleccionadas,
    deleteAllMateriasSeleccionadas,
  } = useMateriasSeleccionadas();
  const exportScheduleRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hasSelectedMaterias = materiasSeleccionadas.length > 0;

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
    <div className="min-h-screen bg-base-200">
      <Navbar
        hasSelectedMaterias={hasSelectedMaterias}
        onExportPng={handleExportPng}
        onExportIcs={handleExportIcs}
      />

      <BuscarMateriasSidebar
        selectedMaterias={materiasSeleccionadas}
        pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <SelectedMateriasList
        selectedMaterias={materiasSeleccionadas}
        popFromMateriasSeleccionadas={popFromMateriasSeleccionadas}
        deleteAllMateriasSeleccionadas={deleteAllMateriasSeleccionadas}
      />

      <main className="container mx-auto p-4 space-y-6 max-w-6xl">
        <Tabs defaultValue="semanal">
          <div className="mb-2">
            <TabsList>
              <TabsTrigger value="semanal">Semanal</TabsTrigger>
              <TabsTrigger value="diario">Diario</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-row gap-2 overflow-x-auto">
            <TabsContent value="semanal">
              <WeeklySchedule
                selectedMaterias={materiasSeleccionadas}
                heightInRem={3}
              />
            </TabsContent>
            <TabsContent value="diario">
              <DailySchedule selectedMaterias={materiasSeleccionadas} />
            </TabsContent>
            <BuscarMaterias
              variant="card"
              selectedMaterias={materiasSeleccionadas}
              pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
            />
          </div>
        </Tabs>

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

      <Footer />
    </div>
  );
}

export default App;
