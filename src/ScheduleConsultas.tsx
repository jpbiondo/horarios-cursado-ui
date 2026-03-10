import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import Navbar from "./components/Navbar";
import { NotFoundView } from "./components/NotFoundView";
import { Button } from "./components/ui/button";
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
  const {
    consultas,
    fetchConsultas,
    loading: consultasLoading,
  } = useConsultasFiltered();
  const { fetchMateriaByName } = useMaterias();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedConsultas, setSelectedConsultas] = useState<Consulta[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loadingFromUrl, setLoadingFromUrl] = useState(false);

  const isValidModo = params.modo === "materia" || params.modo === "profesor";
  const hasParams = params.modo && params.nombre;

  useEffect(() => {
    if (!hasParams) {
      setNotFound(false);
      return;
    }

    if (!isValidModo) {
      setNotFound(true);
      return;
    }

    setNotFound(false);
    setLoadingFromUrl(true);

    const loadFromUrl = async () => {
      try {
        if (params.modo === "materia") {
          const nombre = decodeURIComponent(params.nombre ?? "");
          const materia = await fetchMateriaByName(nombre);
          if (!materia) {
            setNotFound(true);
            return;
          }
          await fetchConsultas("byMateria", null, materia.id);
        } else if (params.modo === "profesor") {
          const profesor = decodeURIComponent(params.nombre ?? "");
          if (!profesor) {
            setNotFound(true);
            return;
          }
          await fetchConsultas("byProfesor", profesor, null);
        }
      } finally {
        setLoadingFromUrl(false);
      }
    };
    loadFromUrl();
  }, [
    params.modo,
    params.nombre,
    hasParams,
    isValidModo,
    fetchConsultas,
    fetchMateriaByName,
  ]);

  useEffect(() => {
    if (params.modo && params.nombre) {
      setSelectedConsultas(consultas);
    }
  }, [params.modo, params.nombre, consultas]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  return (
    <div className="app-root bg-base-200 min-h-0 h-full flex flex-col overflow-hidden relative">
      <Navbar
        rightContent={
          <>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="gap-2"
            >
              <Copy className="size-4" />
              Copiar link
            </Button>
            <ThemeToggle />
          </>
        }
      />

      <BuscarConsultasSidebar
        setSelectedConsultas={setSelectedConsultas}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <main className="w-full max-w-full mx-auto flex-1 min-h-0 flex flex-col relative">
        <div className="flex-shrink-0 z-20 w-full overflow-hidden flex flex-row justify-center items-center bg-primary-foreground p-2 min-h-12 borber-b border-border">
          <span className="text-md md:text-lg font-semibold text-center uppercase tracking-wide">
            {params.nombre
              ? `Horarios consulta de ${params.nombre}`
              : "Horarios de consulta"}
          </span>
        </div>
        <div className="flex-1 min-h-0 flex flex-row gap-0 overflow-hidden w-full">
          <div className="schedule-scroll flex-1 flex flex-col relative min-h-0 overflow-y-auto overflow-x-auto touch-pan-y">
            <div className="flex-1 px-4 pt-4 md:px-0 md:pt-0">
              {notFound ? (
                <NotFoundView />
              ) : (
                <WeeklyConsultas
                  selectedConsultas={selectedConsultas}
                  loading={loadingFromUrl || consultasLoading}
                />
              )}
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
