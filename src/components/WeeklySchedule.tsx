import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { WEEKDAYS } from "../constants";
import {
  getDifferenceInHours,
  getHours,
  MATERIA_COLOR_CLASSES,
  parseCarreraMateriasToEvents,
  parseTime,
} from "../lib/utils";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const todayIndex = (() => {
  const jsDay = new Date().getDay(); // 0–6, Sun–Sat
  return (jsDay + 6) % 7; // shift so Monday=0
})();

interface WeeklyScheduleProps {
  selectedMaterias?: MateriaByComisionDTO[];
  containerRef?: React.Ref<HTMLDivElement>;
  hideCurrentTimeIndicator?: boolean;
  hideTodayHighlight?: boolean;
  startHourOverride?: number;
  heightInRem?: number;
}
const WeeklySchedule = ({
  selectedMaterias,
  containerRef,
  hideCurrentTimeIndicator,
  hideTodayHighlight,
  startHourOverride,
  heightInRem = 2.5,
}: WeeklyScheduleProps) => {
  const [currentTime, setCurrentTime] = useState(format(new Date(), "HH:mm"));
  const calendarEvents = useMemo(
    () => parseCarreraMateriasToEvents(selectedMaterias || []),
    [selectedMaterias],
  );

  const eventsByDayAndHour = useMemo(() => {
    const map = new Map<string, typeof calendarEvents>();
    for (const event of calendarEvents) {
      const hourKey = format(parseTime(event.startHour), "HH");
      const key = `${event.day}-${hourKey}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    return map;
  }, [calendarEvents]);

  const currentTimeDate = parseTime(currentTime);
  const currentHour = format(currentTimeDate, "HH");
  const currentMinutePercent =
    (Number(format(currentTimeDate, "mm")) / 60) * 100;

  const effectiveStartHour = startHourOverride ?? 8;
  const hours = useMemo(
    () => getHours({ startHour: effectiveStartHour }),
    [effectiveStartHour],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm"));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-y-auto h-full max-h-[52rem]">
      <div
        ref={containerRef}
        className="min-w-full relative grid grid-cols-[repeat(7,minmax(120px,1fr))] border border-b-0 border-border max-h-52"
      >
        {/* Table Header */}
        <div className="border-r sticky top-0 z-30 border-border p-2 text-center font-medium bg-secondary">
          Hora
        </div>
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`bg-secondary border-r sticky top-0 z-30 ${index === WEEKDAYS.length - 1 && "border-r-0"} border-border p-2 text-center font-medium transition-colors ${
              !hideTodayHighlight && index === todayIndex ? "text-red-600" : ""
            }`}
          >
            {day}
          </div>
        ))}

        {/* Table Body */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Hour column */}
            <div className="border-r border-b border-border text-center bg-base-100 flex items-center justify-center font-semibold text-primary/80 text-base">
              {hour}
            </div>
            {/* Day columns */}
            {WEEKDAYS.map((day, index) => (
              <div
                key={day + hour}
                className={`relative border-r ${index === WEEKDAYS.length - 1 && "border-r-0"} border-b border-border transition-colors hover:bg-base-200/50 ${
                  !hideTodayHighlight && todayIndex === index
                    ? "bg-base-200/30"
                    : "bg-base-100"
                }`}
                style={{
                  height: `${heightInRem}rem`,
                }}
              >
                {/* Render event if it starts at this hour */}
                {(() => {
                  const hourKey = hour.split(":")[0];
                  const cellEvents =
                    eventsByDayAndHour.get(`${day}-${hourKey}`) ?? [];
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
                              top: `${(eventStartTime.getMinutes() / 60) * heightInRem}rem`,
                              height: `${durationInHours * heightInRem}rem`,
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

                {/* CURRENT TIME INDICATOR */}
                {!hideCurrentTimeIndicator &&
                  currentHour === hour.split(":")[0] && (
                    <div
                      className="absolute left-0 w-full h-[2px] bg-destructive/60 flex justify-start items-center z-20"
                      style={{
                        top: `${currentMinutePercent}%`,
                      }}
                    >
                      {index === 0 && (
                        <div className="flex">
                          <Badge
                            variant="destructive"
                            className="!bg-destructive/90"
                          >
                            {currentTime}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
