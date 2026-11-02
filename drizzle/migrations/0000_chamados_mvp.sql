CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário vê apenas o próprio registro" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE TABLE public.chamados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  nome varchar(120) NOT NULL CHECK (char_length(btrim(nome)) BETWEEN 3 AND 120),
  whatsapp varchar(11) NOT NULL CHECK (whatsapp ~ '^[1-9][0-9]{9,10}$'),
  email varchar(254) CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  categoria text NOT NULL CHECK (categoria IN ('Computadores e notebooks','Redes e internet','Impressoras e periféricos','Software e sistemas','Outros')),
  assunto varchar(150) NOT NULL CHECK (char_length(btrim(assunto)) BETWEEN 5 AND 150),
  descricao text NOT NULL CHECK (char_length(btrim(descricao)) BETWEEN 10 AND 2000),
  status text NOT NULL DEFAULT 'Aberto' CHECK (status IN ('Aberto','Em andamento','Concluído','Cancelado')),
  observacoes_internas text CHECK (observacoes_internas IS NULL OR char_length(observacoes_internas) <= 5000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX chamados_created_at_idx ON public.chamados (created_at DESC);
CREATE INDEX chamados_status_idx ON public.chamados (status);
GRANT SELECT, UPDATE ON public.chamados TO authenticated;
GRANT ALL ON public.chamados TO service_role;
ALTER TABLE public.chamados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin lista chamados" ON public.chamados FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin atualiza chamados" ON public.chamados FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Admin só pode alterar status e observações
CREATE OR REPLACE FUNCTION public.chamados_before_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF current_user <> 'service_role' AND (
     NEW.id <> OLD.id OR NEW.nome <> OLD.nome OR NEW.whatsapp <> OLD.whatsapp
     OR NEW.email IS DISTINCT FROM OLD.email OR NEW.categoria <> OLD.categoria
     OR NEW.assunto <> OLD.assunto OR NEW.descricao <> OLD.descricao OR NEW.created_at <> OLD.created_at) THEN
    RAISE EXCEPTION 'Somente status e observações podem ser alterados';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER chamados_set_updated BEFORE UPDATE ON public.chamados FOR EACH ROW EXECUTE FUNCTION public.chamados_before_update();

-- Limite de frequência por origem
CREATE TABLE public.chamados_rate_limit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  origem_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX chamados_rate_limit_idx ON public.chamados_rate_limit (origem_hash, created_at);
GRANT ALL ON public.chamados_rate_limit TO service_role;
ALTER TABLE public.chamados_rate_limit ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.criar_chamado(
  p_nome text, p_whatsapp text, p_email text, p_categoria text, p_assunto text, p_descricao text, p_origem_hash text
) RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_numero bigint;
BEGIN
  DELETE FROM public.chamados_rate_limit WHERE created_at < now() - interval '1 day';
  IF (SELECT count(*) FROM public.chamados_rate_limit
      WHERE origem_hash = p_origem_hash AND created_at > now() - interval '10 minutes') >= 5 THEN
    RAISE EXCEPTION 'RATE_LIMIT';
  END IF;
  INSERT INTO public.chamados_rate_limit (origem_hash) VALUES (p_origem_hash);
  INSERT INTO public.chamados (nome, whatsapp, email, categoria, assunto, descricao)
  VALUES (btrim(p_nome), p_whatsapp, NULLIF(btrim(coalesce(p_email,'')), ''), p_categoria, btrim(p_assunto), btrim(p_descricao))
  RETURNING numero INTO v_numero;
  RETURN v_numero;
END $$;
REVOKE EXECUTE ON FUNCTION public.criar_chamado(text,text,text,text,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.criar_chamado(text,text,text,text,text,text,text) TO service_role;