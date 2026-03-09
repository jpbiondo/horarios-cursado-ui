import logo from "../assets/logo.png";

interface NavbarProps {
  rightContent?: React.ReactNode;
}

export default function Navbar({ rightContent }: NavbarProps) {
  return (
    <header className="z-10 flex-shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between gap-2 px-1 sm:px-4">
        <div className="flex items-center gap-1">
          <a href="/">
            <img src={logo} className="block h-14 dark:invert" />
          </a>
        </div>

        <nav className="flex shrink-0 items-center gap-2">{rightContent}</nav>
      </div>
    </header>
  );
}
