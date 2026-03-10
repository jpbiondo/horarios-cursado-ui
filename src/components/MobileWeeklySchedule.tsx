import { CalendarSearch } from "lucide-react";
import React, { useMemo, useState } from "react";
import { WEEKDAYS } from "../constants";
import {
  EVENT_COLOR_CLASSES,
  parseCarreraMateriasToEvents,
} from "../lib/utils";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { Badge } from "./ui/badge";
import { MateriaConsultasModal } from "./MateriaConsultasModal";

const DAY_LABELS: Record<string, string> = {
  lun: "LUNES",
  mar: "MARTES",
  mié: "MIÉRCOLES",
  jue: "JUEVES",
  vie: "VIERNES",
  sáb: "SÁBADO",
};

interface MobileWeeklyScheduleProps {
  selectedMaterias?: MateriaByComisionDTO[];
  containerRef?: React.Ref<HTMLDivElement>;
}

export default function MobileWeeklySchedule({
  selectedMaterias,
  containerRef,
}: MobileWeeklyScheduleProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const [eventDialogOpen, setEventDialogOpen] = useState<boolean>(false);

  const eventsByDay = useMemo(() => {
    const calendarEvents = parseCarreraMateriasToEvents(selectedMaterias || []);
    const map = new Map<string, typeof calendarEvents>();
    for (const event of calendarEvents) {
      if (!map.has(event.day)) map.set(event.day, []);
      map.get(event.day)!.push(event);
    }
    for (const [, arr] of map) {
      arr.sort((a, b) => a.startHour.localeCompare(b.startHour));
    }
    return map;
  }, [selectedMaterias]);

  const isEmpty = !selectedMaterias?.length;

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
            No hay materias seleccionadas
          </p>
          <p className="text-sm text-muted-foreground">
            Busca materias en el panel lateral para añadirlas al calendario
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-6 pb-4">
      {WEEKDAYS.map((dayKey) => {
        const dayEvents = eventsByDay.get(dayKey) ?? [];
        const dayLabel = DAY_LABELS[dayKey] ?? dayKey.toUpperCase();
        // const isToday = !hideTodayHighlight && index === todayIndex;

        if (dayEvents.length === 0) return null;

        return (
          <section key={dayKey} className="flex flex-col gap-3">
            <h2
              className={`text-base font-semibold uppercase tracking-wide text-foreground`}
            >
              {dayLabel}
            </h2>

            <div className="flex flex-col gap-2">
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

                const lastSpace = event.desc.lastIndexOf(" ");
                const subjectName =
                  lastSpace > 0 ? event.desc.slice(0, lastSpace) : event.desc;

                return (
                  <div
                    role="button"
                    key={`${dayKey}-${eventIndex}`}
                    className={`flex overflow-hidden rounded-lg border border-border bg-card shadow-sm cursor-pointer ${leftBorder}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div
                      className={`flex flex-1 flex-col gap-1.5 p-3 ${bgClass} rounded-r-lg`}
                    >
                      <span className="text-xs font-medium">
                        {event.startHour} - {event.endHour}
                      </span>
                      <h3 className="font-semibold leading-tight">
                        {subjectName}
                      </h3>
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
                );
              })}
            </div>
          </section>
        );
      })}
      <MateriaConsultasModal
        isOpen={eventDialogOpen}
        setIsOpen={setEventDialogOpen}
        selectedEvent={selectedEvent}
      />
    </div>
  );
}
