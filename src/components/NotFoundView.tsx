import { FileQuestion } from "lucide-react";

export function NotFoundView() {
  return (
    <div className="flex h-full min-w-full flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted/20 py-16">
      <FileQuestion className="size-12 text-muted-foreground" />
      <div className="space-y-1 text-center">
        <p className="font-medium text-foreground">
          No se han encontrado consultas
        </p>

        <p className="text-sm text-muted-foreground max-w-md">
          El enlace es inválido. Podés buscar otras consultas en el panel
          lateral.
        </p>
      </div>
    </div>
  );
}
