import {
  differenceInMinutes,
  format,
  isBefore,
  max,
  min,
  parse,
} from "date-fns";
import { DAY_HOURS, SEMESTER_END } from "../constants";
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
    (_, i) => `${String((i + startHour) % DAY_HOURS).padStart(2, "0")}:00`,
  );
};

export const parseTime = (time: string) => parse(time, "HH:mm", new Date());

export const getDifferenceInHours = (startTime: string, endTime: string) => {
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());

  return differenceInMinutes(end, start) / 60;
};

const MATERIA_COLOR_PALETTE = [
  "blue",
  "red",
  "green",
  "orange",
  "purple",
  "cyan",
  "amber",
  "rose",
  "indigo",
  "emerald",
] as const;

export const MATERIA_COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-500/25 border-blue-500 text-blue-900 dark:text-blue-100",
  red: "bg-red-500/25 border-red-500 text-red-900 dark:text-red-100",
  green: "bg-green-500/25 border-green-500 text-green-900 dark:text-green-100",
  orange:
    "bg-orange-500/25 border-orange-500 text-orange-900 dark:text-orange-100",
  purple:
    "bg-purple-500/25 border-purple-500 text-purple-900 dark:text-purple-100",
  cyan: "bg-cyan-500/25 border-cyan-500 text-cyan-900 dark:text-cyan-100",
  amber: "bg-amber-500/25 border-amber-500 text-amber-900 dark:text-amber-100",
  rose: "bg-rose-500/25 border-rose-500 text-rose-900 dark:text-rose-100",
  indigo:
    "bg-indigo-500/25 border-indigo-500 text-indigo-900 dark:text-indigo-100",
  emerald:
    "bg-emerald-500/25 border-emerald-500 text-emerald-900 dark:text-emerald-100",
};

export const buildMateriaColorMap = (
  materias: MateriaByComisionDTO[],
): Map<string, string> => {
  const seen = new Set<string>();
  const orderedKeys: string[] = [];
  for (const m of materias) {
    const key = `${m.materiaNombre}|${m.comisionNombre}`;
    if (!seen.has(key)) {
      seen.add(key);
      orderedKeys.push(key);
    }
  }
  orderedKeys.sort();

  const map = new Map<string, string>();
  for (let i = 0; i < orderedKeys.length; i++) {
    map.set(
      orderedKeys[i],
      MATERIA_COLOR_PALETTE[i % MATERIA_COLOR_PALETTE.length],
    );
  }
  return map;
};

export const getMateriaColor = (
  materias: MateriaByComisionDTO[],
  materiaNombre: string,
  comisionNombre: string,
): string => {
  const colorMap = buildMateriaColorMap(materias);
  const key = `${materiaNombre}|${comisionNombre}`;
  return colorMap.get(key) ?? "blue";
};

export const parseCarreraMateriasToEvents = (
  carreraMaterias: MateriaByComisionDTO[],
) => {
  const colorMap = buildMateriaColorMap(carreraMaterias);
  const events: CalendarEvent[] = [];

  for (const materia of carreraMaterias) {
    const color =
      colorMap.get(`${materia.materiaNombre}|${materia.comisionNombre}`) ??
      "blue";
    for (const horario of materia.horarios) {
      events.push({
        title: `${materia.materiaNombreAbrev ?? materia.materiaNombre} ${materia.comisionNombre}`,
        desc: `${materia.materiaNombre} ${materia.comisionNombre}`,
        startHour: horario.horaDesde.substring(0, 5),
        endHour: horario.horaHasta.substring(0, 5),
        day: getAbreviacionDia(horario.dia),
        color,
      });
    }
  }

  return events;
};

export const getAbreviacionDia = (dia: string): string => {
  return dia.toLowerCase().slice(0, 3);
};

// A genuine show of love of the craft
// Or just a shattering soul. Who cares anyway
export const haySuperposicionHorarios = (
  nuevaMateria: MateriaByComisionDTO,
  materiasSeleccionadas: MateriaByComisionDTO[],
) => {
  if (materiasSeleccionadas.length === 0) return false;

  const horariosNuevos = nuevaMateria.horarios;

  for (const horarioNuevo of horariosNuevos) {
    const horaDesdeHNuevo = parseTime(horarioNuevo.horaDesde);
    const horaHastaHNuevo = parseTime(horarioNuevo.horaHasta);

    for (const materia of materiasSeleccionadas) {
      for (const horarioMateria of materia.horarios) {
        if (horarioMateria.dia !== horarioNuevo.dia) continue;

        const horaDesdeHMat = parseTime(horarioMateria.horaDesde);
        const horaHastaHMat = parseTime(horarioMateria.horaHasta);

        if (
          isBefore(horaDesdeHMat, horaHastaHNuevo) &&
          isBefore(horaDesdeHNuevo, horaHastaHMat)
        ) {
          const superposicionMins = differenceInMinutes(
            min([horaHastaHMat, horaHastaHNuevo]),
            max([horaDesdeHMat, horaDesdeHNuevo]),
          );
          return superposicionMins > 45;
        }
      }
    }
  }
  return false;
};

// Function to format time from HH:MM:SS to HH:MM
export const formatTime = (time: string): string => {
  if (time.length > 5) {
    return time.substring(0, 5);
  }
  return time;
};

// Function to create compact schedule string
export const formatCompactSchedule = (horarios: any[]): string => {
  return horarios
    .map((horario) => {
      const day = getAbreviacionDia(horario.dia);
      const startTime = formatTime(horario.horaDesde);
      const endTime = formatTime(horario.horaHasta);
      return `${day} ${startTime}-${endTime}`;
    })
    .join("; ");
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getDiaSemanaIndex = (dia: string): number => {
  switch (dia) {
    case "Lunes":
      return 1;
    case "Martes":
      return 2;
    case "Miércoles":
      return 3;
    case "Jueves":
      return 4;
    case "Viernes":
      return 5;
    case "Sábado":
      return 6;
    case "Domingo":
      return 0;
    default:
      return 1;
  }
};

const getFirstOccurrenceOnOrAfter = (
  semesterStart: Date,
  targetWeekday: number,
): Date => {
  const date = new Date(semesterStart.getTime());
  const diff = (targetWeekday - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff);
  return date;
};

const formatIcsDate = (d: Date): string => {
  return format(d, "yyyyMMdd'T'HHmmss");
};

export const buildIcsFromMaterias = (
  materias: MateriaByComisionDTO[],
  semesterStart: Date,
): string => {
  if (!materias.length) {
    return "";
  }

  const lines: string[] = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//horarios-calendario-ui//UTN Calendar//ES");

  const dtStamp = formatIcsDate(new Date());
  const until = format(SEMESTER_END, "yyyyMMdd'T'HHmmss'Z'");

  materias.forEach((materia, materiaIndex) => {
    materia.horarios.forEach((horario, horarioIndex) => {
      const weekday = getDiaSemanaIndex(horario.dia);
      const firstDate = getFirstOccurrenceOnOrAfter(semesterStart, weekday);

      const [startHourStr, startMinuteStr] = formatTime(
        horario.horaDesde,
      ).split(":");
      const [endHourStr, endMinuteStr] = formatTime(horario.horaHasta).split(
        ":",
      );

      const startDate = new Date(firstDate.getTime());
      startDate.setHours(Number(startHourStr), Number(startMinuteStr), 0, 0);

      const endDate = new Date(firstDate.getTime());
      endDate.setHours(Number(endHourStr), Number(endMinuteStr), 0, 0);

      const dtStart = formatIcsDate(startDate);
      const dtEnd = formatIcsDate(endDate);

      const uid = `materia-${materiaIndex}-${horarioIndex}@horarios-calendario-ui`;
      const summary = `${materia.materiaNombre} ${materia.comisionNombre}`;

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${dtStamp}Z`);
      lines.push(`DTSTART:${dtStart}`);
      lines.push(`DTEND:${dtEnd}`);
      lines.push(`RRULE:FREQ=WEEKLY;UNTIL=${until}`);
      lines.push(`SUMMARY:${summary}`);
      lines.push("END:VEVENT");
    });
  });

  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
};
