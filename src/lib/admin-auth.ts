import { supabase } from "@/integrations/supabase/client";

/** Retorna o estado do usuário atual: sem sessão, autenticado sem permissão, ou administrador. */
export async function verificarAdmin(): Promise<
  { estado: "anonimo" } | { estado: "negado"; email: string } | { estado: "admin"; email: string }
> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { estado: "anonimo" };
  const { data: ok, error } = await supabase.rpc("is_admin");
  const email = data.user.email ?? "";
  if (error || !ok) return { estado: "negado", email };
  return { estado: "admin", email };
}
