import { describe, expect, it } from "vitest";
import { chamadoSchema, formatarNumero, linkWhatsapp } from "@/lib/chamados";

const valido = {
  nome: "Maria Souza",
  whatsapp: "(11) 91234-5678",
  email: "",
  categoria: "Redes e internet",
  assunto: "Internet caindo",
  descricao: "A conexão cai várias vezes por dia.",
  consentimento: true,
};

describe("regras do chamado", () => {
  it("aceita chamado válido e guarda WhatsApp só com dígitos", () => {
    const r = chamadoSchema.parse(valido);
    expect(r.whatsapp).toBe("11912345678");
  });
  it("rejeita WhatsApp com menos de 10 dígitos", () => {
    expect(chamadoSchema.safeParse({ ...valido, whatsapp: "119123" }).success).toBe(false);
  });
  it("rejeita categoria inválida", () => {
    expect(chamadoSchema.safeParse({ ...valido, categoria: "Hackear" }).success).toBe(false);
  });
  it("exige consentimento", () => {
    expect(chamadoSchema.safeParse({ ...valido, consentimento: false }).success).toBe(false);
  });
  it("descarta campos internos enviados pelo público", () => {
    const r = chamadoSchema.parse({ ...valido, status: "Concluído", observacoes_internas: "x" });
    expect(r).not.toHaveProperty("status");
    expect(r).not.toHaveProperty("observacoes_internas");
  });
  it("formata o número como CF-000001", () => {
    expect(formatarNumero(1)).toBe("CF-000001");
  });
  it("monta link do WhatsApp com 55 e mensagem", () => {
    const url = linkWhatsapp({ nome: "Ana", whatsapp: "11912345678", numero: 7, assunto: "Impressora" });
    expect(url.startsWith("https://wa.me/5511912345678?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1] ?? "")).toBe(
      "Olá, Ana! Estou entrando em contato sobre seu chamado CF-000007, referente a Impressora.",
    );
  });
});
