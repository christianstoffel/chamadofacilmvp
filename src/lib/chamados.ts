import { z } from "zod";

export const CATEGORIAS = [
  "Computadores e notebooks",
  "Redes e internet",
  "Impressoras e periféricos",
  "Software e sistemas",
  "Outros",
] as const;

export const STATUS = ["Aberto", "Em andamento", "Concluído", "Cancelado"] as const;
export type Status = (typeof STATUS)[number];

export const somenteDigitos = (v: string) => v.replace(/\D/g, "");

export const chamadoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo (mínimo de 3 caracteres).")
    .max(120, "O nome pode ter no máximo 120 caracteres."),
  whatsapp: z
    .string()
    .transform(somenteDigitos)
    .refine((v) => /^[1-9][0-9]{9,10}$/.test(v), "Informe um WhatsApp válido com DDD (10 ou 11 dígitos)."),
  email: z
    .string()
    .trim()
    .max(254, "O e-mail pode ter no máximo 254 caracteres.")
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Informe um e-mail válido.")
    .optional()
    .default(""),
  categoria: z.enum(CATEGORIAS, { errorMap: () => ({ message: "Selecione uma categoria válida." }) }),
  assunto: z
    .string()
    .trim()
    .min(5, "O assunto deve ter pelo menos 5 caracteres.")
    .max(150, "O assunto pode ter no máximo 150 caracteres."),
  descricao: z
    .string()
    .trim()
    .min(10, "Descreva o problema com pelo menos 10 caracteres.")
    .max(2000, "A descrição pode ter no máximo 2000 caracteres."),
  consentimento: z.literal(true, { errorMap: () => ({ message: "É necessário confirmar a ciência sobre o uso dos dados." }) }),
});

export type ChamadoInput = z.input<typeof chamadoSchema>;

export const formatarNumero = (n: number) => `CF-${String(n).padStart(6, "0")}`;

export function mascararWhatsapp(v: string) {
  const d = somenteDigitos(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const fmt = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
export const formatarData = (iso: string) => fmt.format(new Date(iso)).replace(",", "");

export function linkWhatsapp(c: { nome: string; whatsapp: string; numero: number; assunto: string }) {
  const msg = `Olá, ${c.nome}! Estou entrando em contato sobre seu chamado ${formatarNumero(c.numero)}, referente a ${c.assunto}.`;
  return `https://wa.me/55${somenteDigitos(c.whatsapp)}?text=${encodeURIComponent(msg)}`;
}
