import { useMemo, useRef, useState } from "react";
import Footer from "./components/Footer";
import SettingsSidebar from "./components/ui/SettingsSidebar";
import BuscarMaterias from "./components/BuscarMaterias";
import { MateriaByComisionDTO } from "./types/MateriaByComisionDTO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import DailySchedule from "./components/DailySchedule";
import WeeklySchedule from "./components/WeeklySchedule";
import { Button } from "./components/ui/button";
import SelectedMateriasList from "./components/SelectedMateriasList";
import { toPng } from "html-to-image";
import { buildIcsFromMaterias } from "./lib/utils";

function App() {
  const [selectedMaterias, setSelectedMaterias] = useState<
    MateriaByComisionDTO[]
  >([]);
  const exportScheduleRef = useRef<HTMLDivElement | null>(null);

  const hasSelectedMaterias = selectedMaterias.length > 0;

  const exportStartHour = useMemo(() => {
    if (!selectedMaterias.length) return undefined;
    const hours: number[] = [];
    selectedMaterias.forEach((materia) => {
      materia.horarios.forEach((horario) => {
        const hour = Number(horario.horaDesde.substring(0, 2));
        if (!Number.isNaN(hour)) {
          hours.push(hour);
        }
      });
    });
    if (!hours.length) return undefined;
    return Math.min(...hours);
  }, [selectedMaterias]);

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
    const icsContent = buildIcsFromMaterias(selectedMaterias, SEMESTER_START);

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
      <SettingsSidebar
        selectedMaterias={selectedMaterias}
        setSelectedMaterias={setSelectedMaterias}
      />

      <SelectedMateriasList
        selectedMaterias={selectedMaterias}
        setSelectedMaterias={setSelectedMaterias}
      />

      <main className="container mx-auto p-4 space-y-6 max-w-6xl">
        <Tabs defaultValue="semanal">
          <div className="flex justify-between mb-2 items-center">
            <TabsList>
              <TabsTrigger value="semanal">Semanal</TabsTrigger>
              <TabsTrigger value="diario">Diario</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleExportPng}
                disabled={!hasSelectedMaterias}
              >
                PNG
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleExportIcs}
                disabled={!hasSelectedMaterias}
              >
                ICS
              </Button>
            </div>
          </div>

          <div className="flex flex-row gap-2 overflow-x-auto">
            <TabsContent value="semanal">
              <WeeklySchedule
                selectedMaterias={selectedMaterias}
              />
            </TabsContent>
            <TabsContent value="diario">
              <DailySchedule selectedMaterias={selectedMaterias} />
            </TabsContent>

            <BuscarMaterias
              variant="card"
              selectedMaterias={selectedMaterias}
              setSelectedMaterias={setSelectedMaterias}
            />
          </div>
        </Tabs>

        {/* Off-screen WeeklySchedule for PNG export (print-friendly) */}
        {hasSelectedMaterias && (
          <div className="absolute -left-[99999px] top-0">
            <WeeklySchedule
              selectedMaterias={selectedMaterias}
              containerRef={exportScheduleRef}
              hideCurrentTimeIndicator
              hideTodayHighlight
              startHourOverride={exportStartHour}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
