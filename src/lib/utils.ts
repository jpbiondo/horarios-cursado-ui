import { differenceInMinutes, parse } from "date-fns";
import { DAY_HOURS } from "../constants";
import { MateriaByComisionDTO } from "../types/MateriaByComisionDTO";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const parseCarreraMateriasToEvents = (
  carreraMaterias: MateriaByComisionDTO[]
) => {
  let events: CalendarEvent[] = [];
  carreraMaterias.forEach((carreraMateria) => {
    carreraMateria.horarios.forEach((horario) => {
      const event: CalendarEvent = {
        title: carreraMateria.materiaNombre + carreraMateria.comisionNombre,
        startHour: horario.horaDesde.substring(0, horario.horaDesde.length - 3),
        endHour: horario.horaHasta.substring(0, horario.horaHasta.length - 3),
        day: horario.dia,
        color: "blue",
      };

      events = [...events, event];
    });
  });

  return events;
};

//TODO: make this work
export const haySuperposicionHorarios = (
  nuevaCarreraMateria: MateriaByComisionDTO,
  carreraMateriasSeleccionadas: MateriaByComisionDTO[]
) => {
  return false;
};

// Spanish day abbreviations mapping
const dayAbbreviations: Record<string, string> = {
  Lunes: "Lun.",
  Martes: "Mar.",
  Miércoles: "Mier.",
  Miercoles: "Mier.", // Alternative spelling
  Jueves: "Jue.",
  Viernes: "Vie.",
  Sábado: "Sáb.",
  Sabado: "Sáb.", // Alternative spelling
  Domingo: "Dom.",
};

// Function to format time from HH:MM:SS to HH:MM
export const formatTime = (time: string): string => {
  return time.substring(0, time.length - 3);
};

// Function to get abbreviated day name
export const getAbbreviatedDay = (day: string): string => {
  return dayAbbreviations[day] || day;
};

// Function to create compact schedule string
export const formatCompactSchedule = (horarios: any[]): string => {
  return horarios
    .map((horario) => {
      const day = getAbbreviatedDay(horario.dia);
      const startTime = formatTime(horario.horaDesde);
      const endTime = formatTime(horario.horaHasta);
      return `${day} ${startTime} - ${endTime}`;
    })
    .join("; \n");
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
