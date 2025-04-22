import { LoginButton } from "./login-button";
import { ThemeModeToggle } from "./theme-mode-toggle";

export const Header = () => {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          HSA Thing
        </h1>
        <p className="text-muted-foreground">
          Manage your health savings account
        </p>
      </div>
      <div className="flex items-center gap-3">
        <LoginButton />
        <ThemeModeToggle />
      </div>
    </header>
  );
};
