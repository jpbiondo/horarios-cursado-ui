import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { WEEKDAYS } from "../constants";
import { calendarEvents } from "../data/calendarEvents";
import { getDurationInMinutes, getHours, parseTime } from "../lib/utils";

const hours = getHours({ startHour: 8 });

const todayIndex = new Date().getDay();

const WeeklySchedule = () => {
  const [currentTime, setCurrentTime] = useState(format(new Date(), "HH:mm"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm"));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" rounded-box border border-base-content/5 bg-base-100">
      <div className="grid grid-cols-7">
        {/* Table Header */}
        <div className="border-r border-b border-base-content/5 p-2 text-center font-bold bg-base-100">
          Hora
        </div>
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`border-r border-b border-base-content/5 p-2 text-center font-bold bg-base-100 ${
              index === todayIndex && "bg-gray-200"
            }`}
          >
            {day}
          </div>
        ))}

        {/* Table Body */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Hour column */}
            <div className="border-r border-b border-base-content/5 p-3 text-center bg-base-100 flex items-center justify-center font-semibold text-lg">
              {hour}
            </div>
            {/* Day columns */}
            {WEEKDAYS.map((day, index) => (
              <div
                key={day + hour}
                className={`relative border-r border-b border-base-content/5 h-16 ${
                  todayIndex === index && "bg-gray-50"
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
                      blue: "bg-blue-500/10 border-blue-500",
                      red: "bg-red-500/10 border-red-500",
                      green: "bg-green-500/10 border-green-500",
                      orange: "bg-orange-500/10 border-orange-500",
                    };

                    const bgClass =
                      colorMap[event.color] || "bg-gray-500/10 border-gray-500";

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
                          {event.title}
                        </span>
                        <span className="text-md">{`${event.startHour}-${event.endHour} `}</span>
                      </div>
                    );
                  })}

                {/* RED LINE ACROSS ALL DAYS */}
                {format(parseTime(currentTime), "HH") ===
                  hour.split(":")[0] && (
                  <div
                    className="absolute left-0 w-full h-[2px] bg-red-500 flex justify-start items-center"
                    style={{
                      top: `${
                        (Number(format(parseTime(currentTime), "mm")) / 60) *
                        100
                      }%`,
                    }}
                  >
                    {index === 0 && (
                      <div className="flex">
                        <div className="bg-red-500 text-white text-xs px-2 font-medium py-1 rounded-sm ml-1">
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
