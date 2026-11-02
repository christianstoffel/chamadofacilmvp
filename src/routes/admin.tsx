import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, ClipboardList, Clock, Inbox, Loader2, LogOut, MessageCircle, RefreshCw, Search, ShieldX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/site-layout";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { verificarAdmin } from "@/lib/admin-auth";
import { STATUS, formatarData, formatarNumero, linkWhatsapp, mascararWhatsapp, type Status } from "@/lib/chamados";

type Chamado = Tables<"chamados">;

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel administrativo — ChamadoFácil" },
      { name: "description", content: "Gerencie os chamados de suporte técnico recebidos." },
      { property: "og:title", content: "Painel administrativo — ChamadoFácil" },
      { property: "og:description", content: "Gerencie os chamados recebidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    const r = await verificarAdmin();
    if (r.estado === "anonimo") throw redirect({ to: "/login" });
    return { acesso: r };
  },
  component: AdminPage,
});

const QK = ["chamados"];

function AdminPage() {
  const { acesso } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((ev) => {
      if (ev === "SIGNED_OUT") navigate({ to: "/login", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function sair() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  if (acesso.estado !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm rounded-2xl border bg-card p-8 text-center shadow-card">
          <ShieldX className="mx-auto size-12 text-destructive" aria-hidden />
          <h1 className="mt-3 text-xl font-semibold">Acesso negado</h1>
          <p className="mt-2 text-sm text-muted-foreground">A conta {acesso.email} não possui permissão administrativa.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Button variant="outline" asChild><Link to="/">Início</Link></Button>
            <Button onClick={sair}><LogOut /> Sair</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden text-sm text-muted-foreground md:inline">Painel administrativo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">{acesso.email}</span>
            <Button variant="outline" size="sm" onClick={sair}><LogOut /> Sair</Button>
          </div>
        </div>
      </header>
      <Painel />
    </div>
  );
}

function Painel() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Status | "Todos">("Todos");
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const q = useQuery({
    queryKey: QK,
    queryFn: async () => {
      const { data, error } = await supabase.from("chamados").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data;
    },
  });

  const chamados = q.data ?? [];
  const contagem = (s: Status) => chamados.filter((c) => c.status === s).length;

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase();
    const tNum = t.replace(/^cf-?/, "").replace(/^0+/, "");
    return chamados.filter((c) => {
      if (filtro !== "Todos" && c.status !== filtro) return false;
      if (!t) return true;
      return (
        c.nome.toLowerCase().includes(t) ||
        c.assunto.toLowerCase().includes(t) ||
        formatarNumero(c.numero).toLowerCase().includes(t) ||
        (tNum !== "" && String(c.numero) === tNum)
      );
    });
  }, [chamados, busca, filtro]);

  const atual = chamados.find((c) => c.id === selecionado) ?? null;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Painel administrativo</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Indicador icon={ClipboardList} rotulo="Total de chamados" valor={chamados.length} carregando={q.isLoading} />
        <Indicador icon={Inbox} rotulo="Abertos" valor={contagem("Aberto")} carregando={q.isLoading} />
        <Indicador icon={Clock} rotulo="Em andamento" valor={contagem("Em andamento")} carregando={q.isLoading} />
        <Indicador icon={CheckCircle2} rotulo="Concluídos" valor={contagem("Concluído")} carregando={q.isLoading} />
      </div>

      <section className="rounded-2xl border bg-card shadow-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input aria-label="Pesquisar chamados" placeholder="Pesquisar por número, nome ou assunto" className="pl-9" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <select
            aria-label="Filtrar por status"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as Status | "Todos")}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="Todos">Todos</option>
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button variant="outline" onClick={() => q.refetch()} disabled={q.isFetching}>
            <RefreshCw className={q.isFetching ? "animate-spin" : ""} /> Atualizar
          </Button>
        </div>

        {q.isLoading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-muted-foreground"><Loader2 className="animate-spin" /> Carregando chamados...</div>
        ) : q.isError ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <AlertCircle className="size-8 text-destructive" aria-hidden />
            <p className="text-sm">Não foi possível carregar os chamados.</p>
            <Button variant="outline" onClick={() => q.refetch()}>Tentar novamente</Button>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center text-muted-foreground">
            <Inbox className="size-10" aria-hidden />
            <p className="font-medium text-foreground">{chamados.length === 0 ? "Nenhum chamado recebido ainda" : "Nenhum chamado encontrado"}</p>
            <p className="text-sm">{chamados.length === 0 ? "Os chamados abertos pelo formulário público aparecerão aqui." : "Ajuste a pesquisa ou o filtro de status."}</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Número</th><th className="px-4 py-3">Abertura</th><th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Assunto</th><th className="px-4 py-3">Categoria</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-muted/50">
                      <td className="px-4 py-3 font-semibold text-primary">{formatarNumero(c.numero)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatarData(c.created_at)}</td>
                      <td className="px-4 py-3">{c.nome}</td>
                      <td className="max-w-56 truncate px-4 py-3">{c.assunto}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.categoria}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-right"><Button size="sm" variant="outline" onClick={() => setSelecionado(c.id)}>Ver detalhes</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y md:hidden">
              {filtrados.map((c) => (
                <li key={c.id} className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{formatarNumero(c.numero)}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="font-medium">{c.assunto}</p>
                  <p className="text-sm text-muted-foreground">{c.nome} · {c.categoria}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{formatarData(c.created_at)}</span>
                    <Button size="sm" variant="outline" onClick={() => setSelecionado(c.id)}>Ver detalhes</Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <Sheet open={!!atual} onOpenChange={(o) => !o && setSelecionado(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {atual && <Detalhes key={atual.id + atual.updated_at} chamado={atual} />}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function Indicador({ icon: Icon, rotulo, valor, carregando }: { icon: typeof Inbox; rotulo: string; valor: number; carregando: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm">{rotulo}</span>
        <Icon className="size-4" aria-hidden />
      </div>
      <p className="mt-2 text-3xl font-bold">{carregando ? "—" : valor}</p>
    </div>
  );
}

function Detalhes({ chamado }: { chamado: Chamado }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState(chamado.status);
  const [obs, setObs] = useState(chamado.observacoes_internas ?? "");

  const salvar = useMutation({
    mutationFn: async (patch: Partial<Pick<Chamado, "status" | "observacoes_internas">>) => {
      const { data, error } = await supabase.from("chamados").update(patch).eq("id", chamado.id).select("id");
      if (error) throw error;
      if (!data?.length) throw new Error("sem permissão");
    },
    onSuccess: async (_d, patch) => {
      toast.success(patch.status ? "Status atualizado." : "Observações salvas.");
      await qc.invalidateQueries({ queryKey: QK });
    },
    onError: () => toast.error("Não foi possível salvar a alteração. Tente novamente."),
  });

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle className="text-primary">{formatarNumero(chamado.numero)}</SheetTitle>
        <SheetDescription>{chamado.assunto}</SheetDescription>
      </SheetHeader>

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <Info rotulo="Abertura" valor={formatarData(chamado.created_at)} />
        <Info rotulo="Última atualização" valor={formatarData(chamado.updated_at)} />
        <Info rotulo="Solicitante" valor={chamado.nome} />
        <Info rotulo="WhatsApp" valor={mascararWhatsapp(chamado.whatsapp)} />
        <Info rotulo="E-mail" valor={chamado.email || "Não informado"} />
        <Info rotulo="Categoria" valor={chamado.categoria} />
        <div className="col-span-2"><Info rotulo="Status atual" valor={<StatusBadge status={chamado.status} />} /></div>
        <div className="col-span-2">
          <dt className="text-xs text-muted-foreground">Descrição</dt>
          <dd className="mt-1 whitespace-pre-wrap rounded-lg bg-muted p-3">{chamado.descricao}</dd>
        </div>
      </dl>

      <Button variant="success" className="w-full" asChild>
        <a href={linkWhatsapp(chamado)} target="_blank" rel="noopener noreferrer"><MessageCircle /> Entrar em contato pelo WhatsApp</a>
      </Button>

      <div className="space-y-2">
        <Label htmlFor="status">Alterar status</Label>
        <div className="flex gap-2">
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button disabled={salvar.isPending || status === chamado.status} onClick={() => salvar.mutate({ status })}>
            {salvar.isPending && salvar.variables?.status ? <Loader2 className="animate-spin" /> : null} Salvar status
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="obs">Observações internas</Label>
        <Textarea id="obs" rows={6} maxLength={5000} value={obs} onChange={(e) => setObs(e.target.value)} />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{obs.length}/5000</span>
          <Button variant="outline" disabled={salvar.isPending || obs === (chamado.observacoes_internas ?? "")} onClick={() => salvar.mutate({ observacoes_internas: obs })}>
            {salvar.isPending && salvar.variables?.observacoes_internas !== undefined ? <Loader2 className="animate-spin" /> : null} Salvar observações
          </Button>
        </div>
      </div>
    </div>
  );
}

function Info({ rotulo, valor }: { rotulo: string; valor: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{rotulo}</dt>
      <dd className="mt-0.5 font-medium break-words">{valor}</dd>
    </div>
  );
}
