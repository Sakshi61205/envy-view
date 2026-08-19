import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Gauge, History, Settings, Thermometer } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-app-shell min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="bg-gradient-temp grid size-9 place-items-center rounded-xl text-primary-foreground">
              <Thermometer className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">ClimaSense IoT</span>
              <span className="block text-xs text-muted-foreground">Temp & Humidity Monitor</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-primary/10 text-primary" }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground"
            >
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
