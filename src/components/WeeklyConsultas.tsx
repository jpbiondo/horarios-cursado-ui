import { CalendarSearch } from "lucide-react";
import React, { useMemo, useState } from "react";
import { WEEKDAYS } from "../constants";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { EVENT_COLOR_CLASSES, parseConsultasToEvents } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Consulta } from "@/types/Consulta";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const DAY_LABELS: Record<string, string> = {
  lun: "LUNES",
  mar: "MARTES",
  mié: "MIÉRCOLES",
  jue: "JUEVES",
  vie: "VIERNES",
  sáb: "SÁBADO",
};

interface MobileWeeklyScheduleProps {
  selectedConsultas?: Consulta[];
  containerRef?: React.Ref<HTMLDivElement>;
}

export default function WeeklyConsultas({
  selectedConsultas,
  containerRef,
}: MobileWeeklyScheduleProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const [eventDialogOpen, setEventDialogOpen] = useState<boolean>(false);

  const eventsByDay = useMemo(() => {
    const calendarEvents = parseConsultasToEvents(selectedConsultas || []);
    console.log(calendarEvents);
    const map = new Map<string, typeof calendarEvents>();
    for (const event of calendarEvents) {
      if (!map.has(event.day)) map.set(event.day, []);
      map.get(event.day)!.push(event);
    }
    for (const [, arr] of map) {
      arr.sort((a, b) => a.startHour.localeCompare(b.startHour));
    }
    return map;
  }, [selectedConsultas]);

  const isEmpty = !selectedConsultas?.length;

  const isMd = useMediaQuery("(min-width: 768px)");
  const daysToShow = isMd
    ? WEEKDAYS.slice(0, -1)
    : WEEKDAYS.filter((dayKey) => (eventsByDay.get(dayKey)?.length ?? 0) > 0);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  if (isEmpty) {
    return (
      <div
        ref={containerRef}
        className="flex h-full min-w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 py-16"
      >
        <CalendarSearch className="size-12 text-muted-foreground" />
        <div className="space-y-1 text-center">
          <p className="font-medium text-foreground">
            No hay consultas seleccionadas
          </p>
          <p className="text-sm text-muted-foreground">
            Busca consultas en el panel lateral
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row gap-6 md:gap-0 pb-4"
    >
      {daysToShow.map((dayKey, i) => {
        const dayEvents = eventsByDay.get(dayKey) ?? [];
        const dayLabel = DAY_LABELS[dayKey] ?? dayKey.toUpperCase();
        // const isToday = !hideTodayHighlight && index === todayIndex;

        return (
          <>
            <section
              key={dayKey}
              className="flex flex-col gap-3 flex-1 min-w-0 md:p-3"
            >
              <h2
                className={`md:text-center text-base font-semibold uppercase tracking-wide text-foreground`}
              >
                {dayLabel}
              </h2>

              <div className="flex flex-col gap-2 flex-1">
                {dayEvents.map((event, eventIndex) => {
                  const bgClass =
                    EVENT_COLOR_CLASSES[event.color] ??
                    "bg-neutral/20 border-neutral text-neutral-content";

                  const leftBorderMap: Record<string, string> = {
                    blue: "border-l-4 border-l-blue-500",
                    red: "border-l-4 border-l-red-500",
                    green: "border-l-4 border-l-green-500",
                    orange: "border-l-4 border-l-orange-500",
                    purple: "border-l-4 border-l-purple-500",
                    cyan: "border-l-4 border-l-cyan-500",
                    amber: "border-l-4 border-l-amber-500",
                    rose: "border-l-4 border-l-rose-500",
                    indigo: "border-l-4 border-l-indigo-500",
                    emerald: "border-l-4 border-l-emerald-500",
                  };
                  const leftBorder =
                    leftBorderMap[event.color] ??
                    "border-l-4 border-l-neutral-500";

                  return (
                    <>
                      <div
                        key={`${dayKey}-${eventIndex}`}
                        role="button"
                        className={`flex cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-sm ${leftBorder}`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div
                          className={`flex flex-1 flex-col gap-1.5 p-3 md:p-3 ${bgClass} rounded-r-lg`}
                        >
                          <span className="text-xs font-medium">
                            {event.endHour
                              ? event.startHour + " - " + event.endHour
                              : event.startHour}
                          </span>
                          <div>
                            <h3 className="font-semibold leading-tight">
                              {event.title}
                            </h3>
                            <span className="text-sm">{event.desc}</span>
                          </div>
                          {event.comisionNombre && (
                            <Badge
                              variant="outline"
                              className={`${bgClass} bg-transparent`}
                            >
                              {event.comisionNombre}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </section>
            {i < daysToShow.length - 1 && (
              <div
                className="md:block w-px self-stretch shrink-0 bg-border hidden"
                role="separator"
                aria-orientation="vertical"
              />
            )}
          </>
        );
      })}

      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
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
          <div className="flex flex-col gap-2 overflow-y-auto">
            <div>
              <p>
                <b>Horario</b>{" "}
              </p>
              <p>
                {selectedEvent?.endHour
                  ? `${selectedEvent.startHour} - ${selectedEvent.endHour}`
                  : selectedEvent?.startHour}
              </p>
            </div>
            <div>
              <p>
                <b>Notas</b>
              </p>
              <p>{selectedEvent?.note?.trim() || "No hay notas"}</p>
            </div>
            {/* {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-3"
              >
                <span className="truncate flex-1 font-medium">
                  {profile.name}
                </span>
                <span className="text-sm text-muted-foreground shrink-0">
                  {profile.materias.length} materias
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 touch-manipulation"
                    aria-label="Renombrar"
                    onClick={() => {
                      // setManageOpen(false);
                      handleRename(profile);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 touch-manipulation"
                    aria-label="Duplicar"
                    onClick={() => onDuplicateProfile(profile.id)}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 touch-manipulation text-destructive"
                    aria-label="Eliminar"
                    disabled={profiles.length <= 1}
                    onClick={() => onDeleteProfile(profile.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))} */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
