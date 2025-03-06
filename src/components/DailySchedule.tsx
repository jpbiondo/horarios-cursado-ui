import { useState } from "react";
import { WEEKDAYS } from "../constants";
import { calendarEvents } from "../data/calendarEvents";
import { getDurationInMinutes, getHours, parseTime } from "../lib/utils";
import { format } from "date-fns";

const todayIndex = new Date().getDay();

export default function DailySchedule() {
  const hours: string[] = getHours({ startHour: 8 });

  const [currentTime, setCurrentTime] = useState(format(new Date(), "HH:mm"));

  return (
    <div className="rounded-box border border-base-content/5 bg-base-100 max-w-2xl mx-auto">
      <div className="grid grid-cols-4">
        {/* Table Header */}
        <div className="border-r border-b border-base-content/5 p-2 text-center font-bold bg-base-100">
          Hora
        </div>
        <div className=" col-span-3 border-r border-b border-base-content/5 p-2 text-center font-bold bg-base-100">
          Clase
        </div>

        {/* Daily Events */}
        {hours.map((hour) => (
          <>
            {/* Hour column */}
            <div className="col-span-1 border-r border-b border-base-content/5 p-3 text-center bg-base-100 flex items-center justify-center font-semibold text-lg">
              {hour}
            </div>
            <div
              key={hour}
              className={`relative col-span-3 border-r border-b border-base-content/5 h-16`}
            >
              {calendarEvents
                .filter(
                  (event) =>
                    event.day === WEEKDAYS[todayIndex] &&
                    format(parseTime(event.startHour), "HH") ===
                      hour.split(":")[0]
                )
                .map((dailyEvent, index) => {
                  const eventStartTime = parseTime(dailyEvent.startHour);
                  const durationInHours =
                    getDurationInMinutes(
                      dailyEvent.startHour,
                      dailyEvent.endHour
                    ) / 60;
                  console.log(dailyEvent);
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
                  className="absolute left-0 w-full h-[2px] bg-red-500 flex justify-start items-center"
                  style={{
                    top: `${
                      (Number(format(parseTime(currentTime), "mm")) / 60) * 100
                    }%`,
                  }}
                >
                  <div className="flex">
                    <div className="bg-red-500 text-white text-xs px-2 font-medium py-1 rounded-sm ml-1">
                      {currentTime}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
