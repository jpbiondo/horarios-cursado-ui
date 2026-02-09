import { useEffect, useState } from "react";
import { WEEKDAYS } from "../constants";
import {
  getDurationInMinutes,
  getHours,
  parseCarreraMateriasToEvents,
  parseTime,
} from "../lib/utils";
import { format } from "date-fns";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";
import { Badge } from "./ui/badge";

const todayIndex = new Date().getDay() - 1;

interface DailyScheduleProps {
  selectedMaterias?: MateriaByComisionDTO[];
}
const DailySchedule = ({ selectedMaterias }: DailyScheduleProps) => {
  const hours: string[] = getHours({ startHour: 8 });
  const calendarEvents = parseCarreraMateriasToEvents(selectedMaterias || []);
  const [currentTime, setCurrentTime] = useState(format(new Date(), "HH:mm"));

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
            {calendarEvents
              .filter(
                (event) =>
                  event.day === WEEKDAYS[todayIndex] &&
                  format(parseTime(event.startHour), "HH") ===
                    hour.split(":")[0],
              )
              .map((dailyEvent, index) => {
                const eventStartTime = parseTime(dailyEvent.startHour);
                const durationInHours =
                  getDurationInMinutes(
                    dailyEvent.startHour,
                    dailyEvent.endHour,
                  ) / 60;

                const colorMap: Record<string, string> = {
                  blue: "bg-blue-500/10 border-blue-500",
                  red: "bg-red-500/10 border-red-500",
                  green: "bg-green-500/10 border-green-500",
                  orange: "bg-orange-500/10 border-orange-500",
                };

                const bgClass =
                  colorMap[dailyEvent.color] ||
                  "bg-gray-500/10 border-gray-500";

                return (
                  <div
                    key={index}
                    className={`absolute left-1/2 -translate-x-1/2 w-11/12 text-black p-1 border ${bgClass} flex flex-col items-center justify-center z-10`}
                    style={{
                      top: eventStartTime.getMinutes(),
                      height: `${durationInHours * 4}rem`,
                    }}
                  >
                    <span className="text-lg/6 font-semibold">
                      {dailyEvent.title}
                    </span>
                    <span className="text-md">{`${dailyEvent.startHour}-${dailyEvent.endHour} `}</span>
                  </div>
                );
              })}

            {/* RED LINE ACROSS ALL DAYS */}
            {format(parseTime(currentTime), "HH") === hour.split(":")[0] && (
              <div
                className="absolute left-0 w-full h-[2px] bg-destructive/60 flex justify-start items-center"
                style={{
                  top: `${
                    (Number(format(parseTime(currentTime), "mm")) / 60) * 100
                  }%`,
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
