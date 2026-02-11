import {
  differenceInMinutes,
  format,
  isBefore,
  max,
  min,
  parse,
} from "date-fns";
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
    (_, i) => `${String((i + startHour) % DAY_HOURS).padStart(2, "0")}:00`,
  );
};

export const parseTime = (time: string) => parse(time, "HH:mm", new Date());

export const getDifferenceInHours = (startTime: string, endTime: string) => {
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());

  return differenceInMinutes(end, start) / 60;
};

export const parseCarreraMateriasToEvents = (
  carreraMaterias: MateriaByComisionDTO[],
) => {
  let events: CalendarEvent[] = [];
  carreraMaterias.forEach((carreraMateria) => {
    carreraMateria.horarios.forEach((horario) => {
      const event: CalendarEvent = {
        title: `${carreraMateria.materiaNombre} ${carreraMateria.comisionNombre}`,
        startHour: horario.horaDesde.substring(0, 5),
        endHour: horario.horaHasta.substring(0, 5),
        day: mapDiaToDiaAbreviado(horario.dia),
        color: "blue",
      };

      events = [...events, event];
    });
  });

  return events;
};

const mapDiaToDiaAbreviado = (dia: string): string => {
  switch (dia) {
    case "Lunes":
      return "lun";
    case "Martes":
      return "mar";
    case "Miércoles":
      return "mié";
    case "Jueves":
      return "jue";
    case "Viernes":
      return "vie";
    case "Sábado":
      return "sáb";
    default:
      return "lun";
  }
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
  if (time.length > 5) {
    return time.substring(0, 5);
  }
  return time;
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
      return `${day} ${startTime}-${endTime}`;
    })
    .join("; ");
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICS_SEMESTER_END = new Date(2026, 5, 26, 23, 59, 59);

const mapDiaToWeekdayIndex = (dia: string): number => {
  switch (dia) {
    case "Lunes":
      return 1;
    case "Martes":
      return 2;
    case "Miércoles":
    case "Miercoles":
      return 3;
    case "Jueves":
      return 4;
    case "Viernes":
      return 5;
    case "Sábado":
    case "Sabado":
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
  const until = format(ICS_SEMESTER_END, "yyyyMMdd'T'HHmmss'Z'");

  materias.forEach((materia, materiaIndex) => {
    materia.horarios.forEach((horario, horarioIndex) => {
      const weekday = mapDiaToWeekdayIndex(horario.dia);
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
