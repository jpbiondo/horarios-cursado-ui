import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { getAbreviacionDia, getMateriaNombreFromEvent } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useConsultasFiltered } from "@/hooks/useConsultasFiltered";

interface MateriaConsultasModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedEvent?: CalendarEvent;
}
export const MateriaConsultasModal = ({
  isOpen,
  setIsOpen,
  selectedEvent,
}: MateriaConsultasModalProps) => {
  const {
    consultas,
    fetchConsultasByMateriaNombre,
    error: errorConsultas,
    loading: loadingConsultas,
  } = useConsultasFiltered();

  useEffect(() => {
    if (!selectedEvent) return;
    const materiaNombre = getMateriaNombreFromEvent(selectedEvent);
    fetchConsultasByMateriaNombre(materiaNombre);
  }, [selectedEvent, fetchConsultasByMateriaNombre]);

  const sortedConsultas = useMemo(() => {
    const dayOrder: Record<string, number> = {
      lunes: 1,
      martes: 2,
      miercoles: 3,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6,
      sábado: 6,
      domingo: 7,
    };

    const getDayRank = (day: string) =>
      dayOrder[day.trim().toLowerCase()] ?? Number.MAX_SAFE_INTEGER;

    const getHourRank = (hour: string) => {
      const [hours = "0", minutes = "0"] = hour.trim().split(":");
      const parsedHours = Number.parseInt(hours, 10);
      const parsedMinutes = Number.parseInt(minutes, 10);

      if (Number.isNaN(parsedHours) || Number.isNaN(parsedMinutes)) {
        return Number.MAX_SAFE_INTEGER;
      }

      return parsedHours * 60 + parsedMinutes;
    };

    return [...consultas].sort((a, b) => {
      const byDay = getDayRank(a.dia) - getDayRank(b.dia);
      if (byDay !== 0) return byDay;

      return getHourRank(a.horaDesde) - getHourRank(b.horaDesde);
    });
  }, [consultas]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedEvent?.title}</DialogTitle>
          <div>
            <DialogDescription className="font-medium">
              {selectedEvent?.desc}
            </DialogDescription>
            <DialogDescription>
              <a href={`mailto:${selectedEvent?.contact}`}>
                {selectedEvent?.contact}
              </a>
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex flex-col overflow-y-auto">
          <div>
            <p className="font-semibold"> Horario</p>
            <p>
              {selectedEvent?.endHour
                ? `${selectedEvent.startHour} - ${selectedEvent.endHour}`
                : selectedEvent?.startHour}
            </p>
          </div>
          <div>
            <p className="font-semibold">
              Consultas{" "}
              {!loadingConsultas &&
                !errorConsultas &&
                consultas.length !== 0 &&
                `(mostrando ${Math.min(5, consultas.length)} de ${consultas.length})`}
            </p>
            {loadingConsultas ? (
              <div className="flex flex-col gap-3 pt-2">
                {Array(6)
                  .fill(1)
                  .map(() => (
                    <Skeleton className="h-4 w-full" />
                  ))}
              </div>
            ) : errorConsultas || consultas.length === 0 ? (
              <p>No se han encontrado consultas</p>
            ) : (
              <>
                {sortedConsultas.slice(0, 5).map((consulta) => (
                  <p className="text-foreground">
                    <span className="font-medium tracking-wide">
                      ({consulta.horaDesde} - {getAbreviacionDia(consulta.dia)})
                    </span>{" "}
                    {consulta.profesor.nombre}
                  </p>
                ))}
                {5 - consultas.length < 0 && (
                  <p className="text-foreground">...</p>
                )}
                <Link
                  to={`/consultas/materia/${encodeURIComponent(
                    consultas[0]?.materia ??
                      (selectedEvent
                        ? getMateriaNombreFromEvent(selectedEvent)
                        : ""),
                  )}`}
                >
                  <Button variant="link" className="cursor-pointer px-0">
                    Ver las {consultas.length} consultas
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
