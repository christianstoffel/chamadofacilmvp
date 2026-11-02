import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIAS, chamadoSchema, formatarNumero, mascararWhatsapp } from "@/lib/chamados";
import { criarChamado } from "@/lib/chamados.functions";

export const Route = createFileRoute("/abrir-chamado")({
  head: () => ({
    meta: [
      { title: "Abrir chamado — ChamadoFácil" },
      { name: "description", content: "Preencha o formulário e registre sua solicitação de suporte técnico." },
      { property: "og:title", content: "Abrir chamado — ChamadoFácil" },
      { property: "og:description", content: "Registre sua solicitação de suporte técnico em poucos minutos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AbrirChamado,
});

const vazio = { nome: "", whatsapp: "", email: "", categoria: "", assunto: "", descricao: "", consentimento: false };
type Campos = typeof vazio;

function AbrirChamado() {
  const enviar = useServerFn(criarChamado);
  const [form, setForm] = useState<Campos>(vazio);
  const [erros, setErros] = useState<Partial<Record<keyof Campos, string>>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [numero, setNumero] = useState<number | null>(null);

  const set = <K extends keyof Campos>(k: K, v: Campos[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErros((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setErroGeral(null);
    const r = chamadoSchema.safeParse(form);
    if (!r.success) {
      const novo: typeof erros = {};
      for (const i of r.error.issues) {
        const k = i.path[0] as keyof Campos;
        if (!novo[k]) novo[k] = i.message;
      }
      setErros(novo);
      const primeiro = Object.keys(novo)[0];
      if (primeiro) document.getElementById(primeiro)?.focus();
      return;
    }
    setEnviando(true);
    try {
      const res = await enviar({ data: form });
      if (res.ok) {
        setNumero(res.numero);
        setForm(vazio);
        window.scrollTo({ top: 0 });
      } else setErroGeral(res.erro);
    } catch {
      setErroGeral("Falha de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (numero !== null) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-4 py-20">
          <div className="rounded-2xl border bg-card p-8 text-center shadow-card" role="status">
            <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden />
            <h1 className="mt-4 text-2xl font-bold">Chamado aberto com sucesso!</h1>
            <p className="mt-4 text-sm text-muted-foreground">Número do chamado</p>
            <p className="text-3xl font-extrabold tracking-wide text-primary">{formatarNumero(numero)}</p>
            <p className="mt-4 text-muted-foreground">
              Sua solicitação foi registrada. O responsável pelo atendimento poderá entrar em contato pelo WhatsApp informado.
            </p>
            <Button asChild className="mt-6">
              <Link to="/">Voltar ao início</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const erro = (k: keyof Campos) =>
    erros[k] ? <p id={`${k}-erro`} className="text-sm text-destructive">{erros[k]}</p> : null;
  const aria = (k: keyof Campos) => ({ "aria-invalid": !!erros[k], "aria-describedby": erros[k] ? `${k}-erro` : undefined });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">Abrir chamado</h1>
        <p className="mt-2 text-muted-foreground">Preencha os dados abaixo para registrar sua solicitação.</p>

        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5 rounded-2xl border bg-card p-6 shadow-card sm:p-8">
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome completo *</Label>
            <Input id="nome" autoComplete="name" maxLength={120} value={form.nome} onChange={(e) => set("nome", e.target.value)} {...aria("nome")} />
            {erro("nome")}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input id="whatsapp" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(11) 91234-5678" value={form.whatsapp} onChange={(e) => set("whatsapp", mascararWhatsapp(e.target.value))} {...aria("whatsapp")} />
              {erro("whatsapp")}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input id="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
              {erro("email")}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="categoria">Categoria *</Label>
            <select
              id="categoria"
              value={form.categoria}
              onChange={(e) => set("categoria", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...aria("categoria")}
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {erro("categoria")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="assunto">Assunto *</Label>
            <Input id="assunto" maxLength={150} value={form.assunto} onChange={(e) => set("assunto", e.target.value)} {...aria("assunto")} />
            {erro("assunto")}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição do problema *</Label>
            <Textarea id="descricao" rows={6} maxLength={2000} value={form.descricao} onChange={(e) => set("descricao", e.target.value)} {...aria("descricao")} />
            <div className="flex justify-between gap-2">{erro("descricao") ?? <span />}<span className="text-xs text-muted-foreground">{form.descricao.length}/2000</span></div>
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="flex items-start gap-2 text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              Os dados fornecidos serão usados apenas para registrar sua solicitação e permitir o contato referente ao atendimento.
            </p>
            <label className="mt-3 flex items-start gap-2">
              <input id="consentimento" type="checkbox" className="mt-1 size-4 accent-primary" checked={form.consentimento} onChange={(e) => set("consentimento", e.target.checked)} {...aria("consentimento")} />
              <span>Estou ciente de que meus dados serão utilizados para registrar esta solicitação e permitir o contato sobre o atendimento.</span>
            </label>
            {erro("consentimento")}
          </div>

          {erroGeral && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{erroGeral}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={enviando}>
            {enviando ? <><Loader2 className="animate-spin" /> Enviando...</> : "Enviar chamado"}
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}
