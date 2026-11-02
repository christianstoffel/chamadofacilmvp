import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { verificarAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Área administrativa — ChamadoFácil" },
      { name: "description", content: "Acesso restrito ao administrador do ChamadoFácil." },
      { property: "og:title", content: "Área administrativa — ChamadoFácil" },
      { property: "og:description", content: "Acesso restrito ao administrador." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    const r = await verificarAdmin();
    if (r.estado === "admin") throw redirect({ to: "/admin" });
  },
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (carregando) return;
    setErro(null);
    if (!email.trim() || !senha) return setErro("Informe e-mail e senha.");
    setCarregando(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
      if (error) {
        setErro(error.message.toLowerCase().includes("invalid") ? "E-mail ou senha incorretos." : "Não foi possível entrar. Tente novamente.");
        return;
      }
      const r = await verificarAdmin();
      if (r.estado !== "admin") {
        await supabase.auth.signOut();
        setErro("Acesso negado: esta conta não possui permissão administrativa.");
        return;
      }
      navigate({ to: "/admin", replace: true });
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border bg-card p-7 shadow-card">
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-primary" aria-hidden />
            <h1 className="text-lg font-semibold">Área administrativa</h1>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          {erro && <p role="alert" className="text-sm text-destructive">{erro}</p>}
          <Button type="submit" className="w-full" disabled={carregando}>
            {carregando ? <><Loader2 className="animate-spin" /> Entrando...</> : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
