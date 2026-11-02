import { cn } from "@/lib/utils";

const estilos: Record<string, string> = {
  Aberto: "bg-primary-soft text-primary",
  "Em andamento": "bg-warning-soft text-warning",
  Concluído: "bg-success-soft text-success",
  Cancelado: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", estilos[status] ?? estilos.Cancelado)}>
      {status}
    </span>
  );
}
