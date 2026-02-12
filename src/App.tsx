import { useMemo, useRef } from "react";
import Footer from "./components/Footer";
import SettingsSidebar from "./components/ui/SettingsSidebar";
import BuscarMaterias from "./components/BuscarMaterias";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import DailySchedule from "./components/DailySchedule";
import WeeklySchedule from "./components/WeeklySchedule";
import { Button } from "./components/ui/button";
import SelectedMateriasList from "./components/SelectedMateriasList";
import { toPng } from "html-to-image";
import { buildIcsFromMaterias } from "./lib/utils";
import { ButtonGroup } from "./components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { CalendarIcon, EllipsisVertical, ImageIcon } from "lucide-react";
import { useMateriasSeleccionadas } from "./hooks/useMateriasSeleccionadas";

function App() {
  const {
    materiasSeleccionadas,
    pushToMateriasSeleccionadas,
    popFromMateriasSeleccionadas,
    deleteAllMateriasSeleccionadas,
  } = useMateriasSeleccionadas();
  const exportScheduleRef = useRef<HTMLDivElement | null>(null);

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
      <SettingsSidebar
        selectedMaterias={materiasSeleccionadas}
        pushToMateriasSeleccionadas={pushToMateriasSeleccionadas}
      />

      <SelectedMateriasList
        selectedMaterias={materiasSeleccionadas}
        popFromMateriasSeleccionadas={popFromMateriasSeleccionadas}
        deleteAllMateriasSeleccionadas={deleteAllMateriasSeleccionadas}
      />

      <main className="container mx-auto p-4 space-y-6 max-w-6xl">
        <Tabs defaultValue="semanal">
          <div className="flex justify-between mb-2 items-center">
            <TabsList>
              <TabsTrigger value="semanal">Semanal</TabsTrigger>
              <TabsTrigger value="diario">Diario</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <ButtonGroup>
                <Button
                  disabled={!hasSelectedMaterias}
                  onClick={handleExportPng}
                >
                  Exportar
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      aria-label="Export options"
                      disabled={!hasSelectedMaterias}
                    >
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportPng}>
                      <ImageIcon />
                      PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportIcs}>
                      <CalendarIcon />
                      ICS
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ButtonGroup>
            </div>
          </div>

          <div className="flex flex-row gap-2 overflow-x-auto">
            <TabsContent value="semanal">
              <WeeklySchedule selectedMaterias={materiasSeleccionadas} />
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
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
