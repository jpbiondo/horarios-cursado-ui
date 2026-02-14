import { ChevronDown, Copy, Pencil, Plus, Settings, Trash2, User } from "lucide-react";
import { useState } from "react";
import { Profile } from "@/types/Profile";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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

  const handleRename = (profile: Profile) => {
    const name = window.prompt("Nombre del perfil:", profile.name);
    if (name != null && name.trim()) onRenameProfile(profile.id, name.trim());
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
          {profiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              className="py-2.5 min-h-11 touch-manipulation"
              onClick={() => onSelectProfile(profile.id)}
            >
              <span className="truncate flex-1">{profile.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {profile.materias.length}
              </span>
            </DropdownMenuItem>
          ))}
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
                        onClick={() => handleRename(profile)}
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
    </>
  );
}
