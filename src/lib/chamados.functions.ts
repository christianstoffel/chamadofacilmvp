import { createServerFn } from "@tanstack/react-start";
import { chamadoSchema } from "./chamados";

type Resultado = { ok: true; numero: number } | { ok: false; erro: string };

// Ponto de entrada público "criar-chamado": valida no servidor, ignora campos extras
// e insere via função do banco acessível apenas com credencial de serviço.
export const criarChamado = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<Resultado> => {
    const parsed = chamadoSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, erro: parsed.error.issues[0]?.message ?? "Dados inválidos." };
    }
    const v = parsed.data;
    try {
      const { getRequestHeader } = await import("@tanstack/react-start/server");
      const ip =
        getRequestHeader("cf-connecting-ip") ||
        getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
        "desconhecido";
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`cf:${ip}`));
      const origemHash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: numero, error } = await supabaseAdmin.rpc("criar_chamado", {
        p_nome: v.nome,
        p_whatsapp: v.whatsapp,
        p_email: v.email ?? "",
        p_categoria: v.categoria,
        p_assunto: v.assunto,
        p_descricao: v.descricao,
        p_origem_hash: origemHash,
      });
      if (error) {
        if (error.message?.includes("RATE_LIMIT")) {
          return { ok: false, erro: "Muitas solicitações em pouco tempo. Aguarde alguns minutos e tente novamente." };
        }
        console.error("criar_chamado falhou", error.code);
        return { ok: false, erro: "Não foi possível registrar o chamado agora. Tente novamente em instantes." };
      }
      return { ok: true, numero: Number(numero) };
    } catch (e) {
      console.error("criar_chamado erro inesperado");
      return { ok: false, erro: "Não foi possível registrar o chamado agora. Tente novamente em instantes." };
    }
  });
