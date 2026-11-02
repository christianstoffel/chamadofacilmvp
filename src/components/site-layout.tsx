import { Link } from "@tanstack/react-router";
import { Headset } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-md font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Headset className="size-4" aria-hidden />
      </span>
      <span className="text-lg tracking-tight">
        Chamado<span className="text-primary">Fácil</span>
      </span>
    </Link>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />
          <nav className="flex items-center gap-1 sm:gap-3 text-sm">
            <Link to="/" className="hidden sm:inline rounded px-2 py-1 text-muted-foreground hover:text-foreground" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-medium" }}>
              Início
            </Link>
            <Link to="/login" className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
              Área administrativa
            </Link>
            <Button asChild size="sm">
              <Link to="/abrir-chamado">Abrir chamado</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2">
          <div className="space-y-2">
            <Logo />
            <p className="text-sm text-muted-foreground">Gestão simplificada de solicitações de suporte técnico.</p>
            <p className="text-xs text-muted-foreground">
              Projeto demonstrativo de MVP acadêmico, sem compromisso de atendimento comercial real.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm sm:items-end">
            <Link to="/abrir-chamado" className="text-primary hover:underline">Abrir chamado</Link>
            <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground">Área administrativa</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
