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
