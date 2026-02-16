import { describe, it, expect } from "vitest";
import {
  haySuperposicionHorarios,
  parseCarreraMateriasToEvents,
  buildIcsFromMaterias,
  getHours,
  getDifferenceInHours,
  formatTime,
} from "./utils";
import type { MateriaByComisionDTO } from "@/types/MateriaByComisionDTO";

const createMateria = (
  materiaNombre: string,
  comisionNombre: string,
  horarios: { dia: string; horaDesde: string; horaHasta: string }[],
): MateriaByComisionDTO => ({
  materiaNombre,
  comisionNombre,
  horarios,
});

describe("haySuperposicionHorarios (overlap detection)", () => {
  it("returns false when no materias selected", () => {
    const nueva = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    expect(haySuperposicionHorarios(nueva, [])).toBe(false);
  });

  it("returns false when same day but no overlap", () => {
    const existente = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    const nueva = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "10:00", horaHasta: "12:00" },
    ]);
    expect(haySuperposicionHorarios(nueva, [existente])).toBe(false);
  });

  it("returns false when different days", () => {
    const existente = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    const nueva = createMateria("Física", "A", [
      { dia: "Martes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    expect(haySuperposicionHorarios(nueva, [existente])).toBe(false);
  });

  it("returns true when overlap > 45 minutes (full overlap)", () => {
    const existente = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    const nueva = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    expect(haySuperposicionHorarios(nueva, [existente])).toBe(true);
  });

  it("returns true when overlap > 45 minutes (partial overlap)", () => {
    const existente = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "11:00" },
    ]);
    const nueva = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "09:00", horaHasta: "12:00" },
    ]);
    expect(haySuperposicionHorarios(nueva, [existente])).toBe(true);
  });

  it("returns false when overlap exactly 45 minutes (boundary)", () => {
    const existente = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "09:45" },
    ]);
    const nueva = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "09:00", horaHasta: "10:30" },
    ]);
    expect(haySuperposicionHorarios(nueva, [existente])).toBe(false);
  });

  it("returns false when overlap < 45 minutes", () => {
    const existente = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "09:30" },
    ]);
    const nueva = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "09:15", horaHasta: "10:30" },
    ]);
    expect(haySuperposicionHorarios(nueva, [existente])).toBe(false);
  });

  it("returns true when nueva starts before and overlaps > 45 min", () => {
    const existente = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "09:00", horaHasta: "11:00" },
    ]);
    const nueva = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    expect(haySuperposicionHorarios(nueva, [existente])).toBe(true);
  });

  it("returns true when one of multiple horarios overlaps", () => {
    const m1 = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "11:00" },
    ]);
    const m2 = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
      { dia: "Martes", horaDesde: "08:00", horaHasta: "11:00" },
    ]);
    expect(haySuperposicionHorarios(m2, [m1])).toBe(true);
  });

  it("checks all horarios of nueva materia against all selected", () => {
    const existente = createMateria("Matemática", "A", [
      { dia: "Lunes", horaDesde: "14:00", horaHasta: "16:00" },
    ]);
    const nueva = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
      { dia: "Miércoles", horaDesde: "14:00", horaHasta: "16:00" },
    ]);
    expect(haySuperposicionHorarios(nueva, [existente])).toBe(false);
  });
});

describe("parseCarreraMateriasToEvents (scheduling)", () => {
  it("returns empty array for empty materias", () => {
    expect(parseCarreraMateriasToEvents([])).toEqual([]);
  });

  it("parses single materia with one horario", () => {
    const materia = createMateria("Física", "Comisión A", [
      { dia: "Lunes", horaDesde: "08:00:00", horaHasta: "10:00:00" },
    ]);
    const events = parseCarreraMateriasToEvents([materia]);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      title: "Física Comisión A",
      startHour: "08:00",
      endHour: "10:00",
      day: "lun",
    });
    expect(events[0].color).toBeDefined();
  });

  it("parses materia with multiple horarios", () => {
    const materia = createMateria("Matemática", "B", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
      { dia: "Miércoles", horaDesde: "14:00", horaHasta: "16:00" },
    ]);
    const events = parseCarreraMateriasToEvents([materia]);
    expect(events).toHaveLength(2);
    expect(events[0].day).toBe("lun");
    expect(events[1].day).toBe("mié");
  });

  it("maps days correctly", () => {
    const materia = createMateria("Test", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "09:00" },
      { dia: "Martes", horaDesde: "08:00", horaHasta: "09:00" },
      { dia: "Miércoles", horaDesde: "08:00", horaHasta: "09:00" },
      { dia: "Jueves", horaDesde: "08:00", horaHasta: "09:00" },
      { dia: "Viernes", horaDesde: "08:00", horaHasta: "09:00" },
      { dia: "Sábado", horaDesde: "08:00", horaHasta: "09:00" },
    ]);
    const events = parseCarreraMateriasToEvents([materia]);
    expect(events.map((e) => e.day)).toEqual([
      "lun",
      "mar",
      "mié",
      "jue",
      "vie",
      "sáb",
    ]);
  });

  it("assigns consistent colors per materia", () => {
    const materia = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
      { dia: "Miércoles", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    const events = parseCarreraMateriasToEvents([materia]);
    expect(events[0].color).toBe(events[1].color);
  });
});

describe("buildIcsFromMaterias (export)", () => {
  const semesterStart = new Date(2026, 0, 1);

  it("returns empty string for empty materias", () => {
    expect(buildIcsFromMaterias([], semesterStart)).toBe("");
  });

  it("produces valid ICS with VCALENDAR and VEVENT structure", () => {
    const materia = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    const ics = buildIcsFromMaterias([materia], semesterStart);

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("PRODID:-//horarios-calendario-ui");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("SUMMARY:Física A");
    expect(ics).toContain("RRULE:FREQ=WEEKLY");
  });

  it("includes correct DTSTART and DTEND for each event", () => {
    const materia = createMateria("Matemática", "B", [
      { dia: "Martes", horaDesde: "14:00", horaHasta: "16:30" },
    ]);
    const ics = buildIcsFromMaterias([materia], semesterStart);

    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}/);
    expect(ics).toMatch(/DTEND:\d{8}T\d{6}/);
  });

  it("generates unique UIDs per horario", () => {
    const materia = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
      { dia: "Miércoles", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    const ics = buildIcsFromMaterias([materia], semesterStart);

    const uidMatches = ics.match(/UID:([^\r\n]+)/g);
    expect(uidMatches).toHaveLength(2);
    expect(uidMatches![0]).not.toBe(uidMatches![1]);
  });

  it("handles materia with HH:MM:SS format", () => {
    const materia = createMateria("Física", "A", [
      {
        dia: "Lunes",
        horaDesde: "08:30:00",
        horaHasta: "10:45:00",
      },
    ]);
    const ics = buildIcsFromMaterias([materia], semesterStart);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("SUMMARY:Física A");
  });

  it("includes UNTIL in RRULE with semester end", () => {
    const materia = createMateria("Física", "A", [
      { dia: "Lunes", horaDesde: "08:00", horaHasta: "10:00" },
    ]);
    const ics = buildIcsFromMaterias([materia], semesterStart);

    expect(ics).toMatch(/RRULE:FREQ=WEEKLY;UNTIL=\d{8}T\d{6}Z/);
  });
});

describe("getHours", () => {
  it("returns hours from startHour", () => {
    const hours = getHours({ startHour: 8 });
    expect(hours[0]).toBe("08:00");
    expect(hours).toContain("09:00");
  });

  it("respects offset", () => {
    const hours = getHours({ startHour: 10, offset: 3 });
    expect(hours).toHaveLength(3);
    expect(hours).toEqual(["10:00", "11:00", "12:00"]);
  });

  it("throws for invalid startHour", () => {
    expect(() => getHours({ startHour: -1 })).toThrow(RangeError);
    expect(() => getHours({ startHour: 24 })).toThrow(RangeError);
  });
});

describe("getDifferenceInHours", () => {
  it("returns 2 for 08:00 to 10:00", () => {
    expect(getDifferenceInHours("08:00", "10:00")).toBe(2);
  });

  it("returns 1.5 for 08:00 to 09:30", () => {
    expect(getDifferenceInHours("08:00", "09:30")).toBe(1.5);
  });
});

describe("formatTime", () => {
  it("truncates HH:MM:SS to HH:MM", () => {
    expect(formatTime("08:30:00")).toBe("08:30");
  });

  it("returns as-is when already HH:MM", () => {
    expect(formatTime("08:30")).toBe("08:30");
  });
});
