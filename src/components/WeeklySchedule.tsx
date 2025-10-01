import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { WEEKDAYS } from "../constants";
import {
  getDurationInMinutes,
  getHours,
  parseCarreraMateriasToEvents,
  parseTime,
} from "../lib/utils";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";

const hours = getHours({ startHour: 8 });

const todayIndex = new Date().getDay() - 1;

interface WeeklyScheduleProps {
  selectedMaterias?: MateriaByComisionDTO[];
}
const WeeklySchedule = ({ selectedMaterias }: WeeklyScheduleProps) => {
  const [currentTime, setCurrentTime] = useState(format(new Date(), "HH:mm"));
  const calendarEvents = parseCarreraMateriasToEvents(selectedMaterias || []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm"));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  console.log("Desde weekly:", calendarEvents);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full grid grid-cols-7 border border-base-300 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="border-r border-base-300 p-3 text-center font-bold bg-base-200 text-base-content">
          Hora
        </div>
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`border-r last:border-r-0 border-base-300 p-3 text-center font-bold transition-colors ${
              index === todayIndex
                ? "bg-primary text-primary-content"
                : "bg-base-200 text-base-content"
            }`}
          >
            {day}
          </div>
        ))}

        {/* Table Body */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Hour column */}
            <div className="border-r border-b border-base-300 p-3 text-center bg-base-100 flex items-center justify-center font-semibold text-base">
              {hour}
            </div>
            {/* Day columns */}
            {WEEKDAYS.map((day, index) => (
              <div
                key={day + hour}
                className={`relative border-r last:border-r-0 border-b border-base-300 h-16 transition-colors hover:bg-base-200/50 ${
                  todayIndex === index ? "bg-base-200/30" : "bg-base-100"
                }`}
              >
                {/* Render event if it starts at this hour */}
                {calendarEvents
                  .filter(
                    (event) =>
                      event.day === day &&
                      format(parseTime(event.startHour), "HH") ===
                        hour.split(":")[0]
                  )
                  .map((event, index) => {
                    const eventStartTime = parseTime(event.startHour);
                    const durationInHours =
                      getDurationInMinutes(event.startHour, event.endHour) / 60;

                    const colorMap: Record<string, string> = {
                      blue: "bg-info/20 border-info",
                      red: "bg-error/20 border-error text-error-content",
                      green:
                        "bg-success/20 border-success text-success-content",
                      orange:
                        "bg-warning/20 border-warning text-warning-content",
                    };

                    const bgClass =
                      colorMap[event.color] ||
                      "bg-neutral/20 border-neutral text-neutral-content";

                    return (
                      <div
                        key={index}
                        className={`absolute left-1/2 -translate-x-1/2 w-11/12 p-2 border-l-4 rounded-r-md shadow-sm ${bgClass} flex flex-col items-center justify-center z-10 cursor-pointer hover:shadow-md transition-shadow`}
                        style={{
                          top: eventStartTime.getMinutes(),
                          height: `${durationInHours * 4}rem`,
                        }}
                      >
                        <span className="text-sm font-semibold text-center line-clamp-2">
                          {event.title}
                        </span>
                        <span className="text-xs opacity-80">{`${event.startHour}-${event.endHour}`}</span>
                      </div>
                    );
                  })}

                {/* CURRENT TIME INDICATOR */}
                {format(parseTime(currentTime), "HH") ===
                  hour.split(":")[0] && (
                  <div
                    className="absolute left-0 w-full h-[2px] bg-error flex justify-start items-center z-20"
                    style={{
                      top: `${
                        (Number(format(parseTime(currentTime), "mm")) / 60) *
                        100
                      }%`,
                    }}
                  >
                    {index === 0 && (
                      <div className="flex">
                        <div className="badge badge-error text-error-content text-xs font-medium">
                          {currentTime}
                        </div>
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
