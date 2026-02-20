# Horarios UTN

Aplicación web para armar y visualizar horarios de materias de la UTN. Permite crear varios perfiles, explorar posibles combinaciones de cursadas y exportar a PNG o calendario ICS.

## Funcionalidades

- **Buscar materias** por carrera, plan y comisión **o por materia** (tabs)
- **Perfiles múltiples**: crear, renombrar, duplicar y eliminar perfiles
- **Vista semanal** con indicador de hora actual
- **Exportar** a imagen PNG o archivo ICS (Google Calendar, Outlook, etc.)
- **Colores por materia** (paleta de 10 colores distintos)
- **Detección de superposición** de horarios (aviso si superan 45 min)
- **Reinicio automático** al terminar el semestre (localStorage se limpia)
- **Toasts** para errores y avisos
- **Tema claro/oscuro**
- **Responsive** con sidebar en desktop y sheet en móvil

Los datos se guardan en `localStorage` (sin backend).

## Cómo usar

1. Selecciona carrera y plan
2. Elige **Por Comisión** o **Por Materia** y selecciona la comisión o materia
3. Busca las materias y añádelas al horario
4. Crea perfiles para comparar distintas combinaciones
5. Exporta tu horario final

## Desarrollo

```bash
npm install
npm run dev
```

## Tests

```bash
npm run test        # single run
npm run test:watch  # watch mode
```

## Build

```bash
npm run build
```

## Configuración

Editar `src/constants.ts`:

- **Fechas del semestre** para exportar ICS: `SEMESTER_START`, `SEMESTER_END`
- **IDs de semestre** en la base de datos: `CURRENT_SEMESTRE_ID`, `YEARLY_SEMESTER_ID` (materias anuales)

## Contribuir

Las contribuciones son bienvenidas.

1. Haz fork del repositorio
2. Crea una rama para tu cambio (`git checkout -b feature/nombre-feature` o `fix/nombre-fix`)
3. Realiza tus cambios y asegúrate de que pasen los tests (`npm run test`)
4. Haz commit con mensajes claros (`git commit -m 'feat: descripción'`)
5. Envía un pull request hacia la rama `main`

## Reportar problemas

Si encuentras un bug o tienes una sugerencia:

1. Revisa si ya existe un issue abierto
2. Abre un [nuevo issue](issues/new) con:
   - Descripción clara del problema o la idea
   - Pasos para reproducir (si aplica)
   - Comportamiento esperado vs actual
   - Capturas de pantalla (si ayudan)

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Supabase (API de carreras/planes/comisiones)
- Sonner (toasts)
