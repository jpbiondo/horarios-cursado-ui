import { differenceInMinutes, parse } from "date-fns";
import { DAY_HOURS } from "../constants";

export const getHours = ({
  startHour,
  offset = DAY_HOURS - startHour + 1,
}: {
  startHour: number;
  offset?: number;
}): string[] => {
  if (startHour < 0 || startHour > 23) {
    throw new RangeError("startHour must be between 0 and 23.");
  }

  if (offset < 0) {
    throw new RangeError("offset must be a non-negative number.");
  }

  return Array.from(
    { length: Math.min(DAY_HOURS - startHour + 1, offset) },
    (_, i) => `${String((i + startHour) % DAY_HOURS).padStart(2, "0")}:00`
  );
};

export const parseTime = (time: string) => parse(time, "HH:mm", new Date());

export const getDurationInMinutes = (startTime: string, endTime: string) => {
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());

  return differenceInMinutes(end, start);
};
