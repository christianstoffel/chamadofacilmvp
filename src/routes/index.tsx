import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardEdit, Laptop, MessageCircle, Printer, Send, Wifi, Wrench, AppWindow } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChamadoFácil — Abra seu chamado de suporte técnico" },
      { name: "description", content: "Seus chamados organizados, seu atendimento simplificado. Abra uma solicitação de suporte de TI em poucos minutos." },
      { property: "og:title", content: "ChamadoFácil — Suporte técnico simplificado" },
      { property: "og:description", content: "Descreva seu problema e abra um chamado de suporte técnico em poucos minutos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const etapas = [
  { icon: ClipboardEdit, titulo: "Descreva o problema", texto: "Informe seus dados e o serviço necessário." },
  { icon: Send, titulo: "Envie sua solicitação", texto: "Seu chamado será registrado de forma organizada." },
  { icon: MessageCircle, titulo: "Aguarde o contato", texto: "O responsável pelo atendimento entrará em contato para dar continuidade." },
];

const categorias = [
  { icon: Laptop, nome: "Computadores e notebooks" },
  { icon: Wifi, nome: "Redes e internet" },
  { icon: Printer, nome: "Impressoras e periféricos" },
  { icon: AppWindow, nome: "Software e sistemas" },
  { icon: Wrench, nome: "Outros serviços de TI" },
];

function Index() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-hero-grid opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <p className="mx-auto mb-5 inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
            Seus chamados organizados, seu atendimento simplificado.
          </p>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Precisa de suporte técnico? <span className="text-primary">Abra seu chamado em poucos minutos.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Descreva seu problema, envie sua solicitação e deixe que nossa equipe entre em contato para ajudar.
          </p>
          <Button asChild size="lg" className="mt-8 shadow-soft">
            <Link to="/abrir-chamado">
              Abrir chamado <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Como funciona</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {etapas.map((e, i) => (
            <li key={e.titulo} className="rounded-xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <e.icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">Etapa {i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold">{e.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{e.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Categorias de atendimento</h2>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categorias.map((c) => (
              <li key={c.nome} className="flex flex-col items-center gap-3 rounded-xl border bg-background p-5 text-center">
                <c.icon className="size-7 text-primary" aria-hidden />
                <span className="text-sm font-medium">{c.nome}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
