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
import { Dispatch, SetStateAction, useEffect } from "react";
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
                `(mostrando 5 de ${consultas.length})`}
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
                {consultas.slice(0, 5).map((consulta) => (
                  <p className="text-foreground">
                    <span className="font-medium tracking-wide">
                      ({consulta.horaDesde} - {getAbreviacionDia(consulta.dia)})
                    </span>{" "}
                    {consulta.profesor.nombre}
                  </p>
                ))}
                <p className="text-foreground">...</p>
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
