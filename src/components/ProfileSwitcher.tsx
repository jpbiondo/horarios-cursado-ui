import {
  Check,
  ChevronDown,
  Copy,
  Pencil,
  Plus,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Profile } from "@/types/Profile";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

interface ProfileSwitcherProps {
  profiles: Profile[];
  activeProfile: Profile | null;
  onSelectProfile: (id: string) => void;
  onCreateProfile: () => void;
  onRenameProfile: (id: string, name: string) => void;
  onDuplicateProfile: (id: string) => void;
  onDeleteProfile: (id: string) => void;
}

export default function ProfileSwitcher({
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
  onRenameProfile,
  onDuplicateProfile,
  onDeleteProfile,
}: ProfileSwitcherProps) {
  const [manageOpen, setManageOpen] = useState(false);
  const [renameProfileState, setRenameProfileState] = useState<Profile | null>(
    null,
  );
  const [renameInputValue, setRenameInputValue] = useState("");

  useEffect(() => {
    if (renameProfileState) {
      setRenameInputValue(renameProfileState.name);
    }
  }, [renameProfileState]);

  const handleRename = (profile: Profile) => {
    setRenameProfileState(profile);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = renameInputValue.trim();
    if (trimmed && renameProfileState) {
      onRenameProfile(renameProfileState.id, trimmed);
      setRenameProfileState(null);
    }
  };

  const handleRenameClose = () => {
    setRenameProfileState(null);
    setRenameInputValue("");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="min-w-0 gap-1.5 px-2 sm:px-3 touch-manipulation min-h-10"
            aria-label="Cambiar perfil"
          >
            <User className="size-4 shrink-0" />
            <span className="truncate max-w-[7rem] sm:max-w-[10rem]">
              {activeProfile?.name ?? "Perfil"}
            </span>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="bottom"
          className="w-[min(calc(100vw-2rem),16rem)] max-h-[70vh] overflow-y-auto"
        >
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfile?.id;
            return (
              <DropdownMenuItem
                key={profile.id}
                className="py-2.5 min-h-11 touch-manipulation"
                onClick={() => onSelectProfile(profile.id)}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="w-4 shrink-0">
                  {isActive && <Check className="size-4" />}
                </span>
                <span className="truncate flex-1">{profile.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {profile.materias.length}
                </span>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="py-2.5 min-h-11 touch-manipulation"
            onClick={onCreateProfile}
          >
            <Plus className="size-4" />
            Nuevo perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-2.5 min-h-11 touch-manipulation"
            onSelect={() => setManageOpen(true)}
          >
            <Settings className="size-4" />
            Gestionar perfiles
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={manageOpen} onOpenChange={setManageOpen}>
        <SheetContent side="bottom" className="h-[70vh] max-h-[32rem]">
          <SheetHeader>
            <SheetTitle>Perfiles</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 overflow-y-auto py-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 p-3"
              >
                <span className="truncate flex-1 font-medium">
                  {profile.name}
                </span>
                <span className="text-sm text-muted-foreground shrink-0">
                  {profile.materias.length} materias
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 touch-manipulation"
                    aria-label="Renombrar"
                    onClick={() => {
                      setManageOpen(false);
                      handleRename(profile);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 touch-manipulation"
                    aria-label="Duplicar"
                    onClick={() => onDuplicateProfile(profile.id)}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 touch-manipulation text-destructive"
                    aria-label="Eliminar"
                    disabled={profiles.length <= 1}
                    onClick={() => onDeleteProfile(profile.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Dialog
        open={!!renameProfileState}
        onOpenChange={(open) => !open && handleRenameClose()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renombrar perfil</DialogTitle>
            <DialogDescription>
              Escribe el nuevo nombre para el perfil.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nombre</Label>
              <input
                id="profile-name"
                type="text"
                value={renameInputValue}
                onChange={(e) => setRenameInputValue(e.target.value)}
                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="Nombre del perfil"
                autoFocus
                autoComplete="off"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleRenameClose}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!renameInputValue.trim()}>
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
