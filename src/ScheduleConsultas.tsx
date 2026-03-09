import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import { useParams } from "react-router";
import WeeklyConsultas from "./components/WeeklyConsultas";
import { useConsultasFiltered } from "./hooks/useConsultasFiltered";
import { useMaterias } from "./hooks/useMaterias";
import BuscarConsultasSidebar from "./components/BuscarConsultasSidebar";
import BuscarConsultas from "./components/BuscarConsultas";
import { Consulta } from "./types/Consulta";

function ScheduleConsultas() {
  const params = useParams();
  const { consultas, fetchConsultas } = useConsultasFiltered();
  const { fetchMateriaByName } = useMaterias();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedConsultas, setSelectedConsultas] = useState<Consulta[]>([]);

  useEffect(() => {
    if (!params.modo || !params.nombre) return;

    const loadFromUrl = async () => {
      if (params.modo === "materia") {
        const nombre = decodeURIComponent(params.nombre ?? "");
        const materia = await fetchMateriaByName(nombre);
        if (materia) fetchConsultas("byMateria", null, materia.id);
      } else if (params.modo === "profesor") {
        const profesor = decodeURIComponent(params.nombre ?? "");
        fetchConsultas("byProfesor", profesor, null);
      }
    };
    loadFromUrl();
  }, [params.modo, params.nombre, fetchConsultas, fetchMateriaByName]);

  useEffect(() => {
    if (params.modo && params.nombre) {
      setSelectedConsultas(consultas);
    }
  }, [params.modo, params.nombre, consultas]);
  return (
    <div className="app-root bg-base-200 min-h-0 h-full flex flex-col overflow-hidden relative">
      <Navbar rightContent={<ThemeToggle />} />

      <BuscarConsultasSidebar
        setSelectedConsultas={setSelectedConsultas}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <main className="w-full max-w-full mx-auto flex-1 min-h-0 flex flex-col relative">
        {/* <SelectedMateriasList
          selectedMaterias={materiasSeleccionadas}
          popFromMateriasSeleccionadas={popFromMateriasSeleccionadas}
          deleteAllMateriasSeleccionadas={deleteAllMateriasSeleccionadas}
        /> */}
        <div className="flex-1 min-h-0 flex flex-row gap-0 overflow-hidden w-full">
          <div className="schedule-scroll flex-1 flex flex-col relative min-h-0 overflow-y-auto overflow-x-auto touch-pan-y">
            <div className="block flex-1">
              <WeeklyConsultas selectedConsultas={selectedConsultas} />
            </div>

            <div className="fixed bottom-0 z-10 w-full border-t border-border"></div>
          </div>
          <aside className="w-80 min-w-80 flex-shrink-0 flex-col border-r border-border bg-background overflow-hidden hidden lg:flex">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-md font-semibold">Buscar consultas</h2>
              <p className="text-sm text-muted-foreground">
                Busca consultas para añadir al calendario
              </p>
            </div>
            <BuscarConsultas
              variant="inline"
              setSelectedConsultas={setSelectedConsultas}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default ScheduleConsultas;
