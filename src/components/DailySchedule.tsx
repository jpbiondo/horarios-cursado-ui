import { useEffect, useMemo, useState } from "react";
import { WEEKDAYS } from "../constants";
import {
  getDifferenceInHours,
  getHours,
  MATERIA_COLOR_CLASSES,
  parseCarreraMateriasToEvents,
  parseTime,
} from "../lib/utils";
import { format } from "date-fns";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const todayIndex = new Date().getDay() - 1;

interface DailyScheduleProps {
  selectedMaterias?: MateriaByComisionDTO[];
}
const DailySchedule = ({ selectedMaterias }: DailyScheduleProps) => {
  const hours: string[] = getHours({ startHour: 8 });
  const calendarEvents = useMemo(
    () => parseCarreraMateriasToEvents(selectedMaterias || []),
    [selectedMaterias],
  );
  const [currentTime, setCurrentTime] = useState(format(new Date(), "HH:mm"));
  const todayEvents = useMemo(
    () => calendarEvents.filter((event) => event.day === WEEKDAYS[todayIndex]),
    [calendarEvents],
  );

  const eventsByHour = useMemo(() => {
    const map = new Map<string, typeof calendarEvents>();
    for (const event of todayEvents) {
      const hourKey = format(parseTime(event.startHour), "HH");
      if (!map.has(hourKey)) map.set(hourKey, []);
      map.get(hourKey)!.push(event);
    }
    return map;
  }, [calendarEvents]);

  const currentTimeDate = parseTime(currentTime);
  const currentHour = format(currentTimeDate, "HH");
  const currentMinutePercent =
    (Number(format(currentTimeDate, "mm")) / 60) * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm"));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md m-auto grid grid-cols-4 border border-b-0 border-border overflow-hidden">
      {/* Table Header */}
      <div className="border-r border-b border-border p-2 text-center font-medium bg-secondary">
        Hora
      </div>
      <div className="col-span-3 border-b border-border p-2 text-center font-medium bg-secondary">
        Clase
      </div>

      {/* Daily Events */}
      {hours.map((hour) => (
        <>
          {/* Hour column */}
          <div className="border-r border-b border-border text-center bg-base-100 flex items-center justify-center font-semibold text-primary/80 text-base">
            {hour}
          </div>
          <div
            key={hour}
            className={`relative col-span-3 border-b border-border h-10`}
          >
            {(() => {
              const hourKey = hour.split(":")[0];
              const cellEvents = eventsByHour.get(hourKey) ?? [];
              return cellEvents.map((event, index) => {
                const eventStartTime = parseTime(event.startHour);
                const durationInHours = getDifferenceInHours(
                  event.startHour,
                  event.endHour,
                );

                const bgClass =
                  MATERIA_COLOR_CLASSES[event.color] ||
                  "bg-neutral/20 border-neutral text-neutral-content";

                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        key={index}
                        className={`absolute left-1/2 -translate-x-1/2 w-11/12 p-2 rounded-lg shadow-sm border-1 flex flex-col items-center justify-center z-10 cursor ${bgClass}`}
                        style={{
                          top: `${(eventStartTime.getMinutes() / 60) * 2.5}rem`,
                          height: `${durationInHours * 2.5}rem`,
                        }}
                      >
                        <span className="text-sm text-center line-clamp-2">
                          {event.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{`${event.startHour}-${event.endHour}`}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{event.title}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              });
            })()}
            {/* RED LINE ACROSS ALL DAYS */}
            {currentHour === hour.split(":")[0] && (
              <div
                className="absolute left-0 w-full h-[2px] bg-destructive/60 flex justify-start items-center"
                style={{
                  top: `${currentMinutePercent}%`,
                }}
              >
                <div className="flex">
                  <Badge variant="destructive" className="!bg-destructive/90">
                    {currentTime}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </>
      ))}
    </div>
  );
};

export default DailySchedule;
