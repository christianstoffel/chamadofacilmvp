# Mega prompt — ChamadoFácil

> Registro estruturado dos requisitos solicitados ao Lovable na primeira construção. **Antes da entrega, substitua este documento pelo texto integral efetivamente colado no Lovable**, preservando a versão histórica real. O texto original está na conversa de planejamento com o ChatGPT.

## Objetivo
Construir uma aplicação web funcional chamada **ChamadoFácil**, em pt-BR, com o slogan "Seus chamados organizados, seu atendimento simplificado.", voltada a profissionais autônomos e pequenas empresas de suporte de TI. Usar Lovable Cloud como backend nativo, com persistência e autenticação. Priorizar execução de ponta a ponta, segurança, simplicidade, responsividade e economia de créditos. Não usar imagens geradas, pagamentos, APIs de terceiros ou serviços extras.

## Páginas
- `/`: landing page pública com apresentação, como funciona, categorias e link administrativo.
- `/abrir-chamado`: formulário público e confirmação com número.
- `/login`: login administrativo.
- `/admin`: painel protegido, listagem, busca e filtros; detalhes em modal/drawer ou rota interna.

## Formulário
Nome completo (3–120), WhatsApp brasileiro com DDD (10–11 dígitos), e-mail opcional, categoria, assunto (5–150), descrição (10–2000), aviso de privacidade e caixa de ciência obrigatória. Categorias: Computadores e notebooks, Redes e internet, Impressoras e periféricos, Software e sistemas, Outros. Validar frontend e backend; evitar duplicidade e confirmar apenas após persistência.

## Modelo de dados
Uma tabela `chamados`: UUID interno, número sequencial, nome, whatsapp, email, categoria, assunto, descricao, status, observacoes_internas, created_at e updated_at. Número exibido no padrão `CF-000001`. Quatro status: Aberto, Em andamento, Concluído, Cancelado. Sem tabela separada de clientes; tabela privada pequena de administradores, se necessária.

## Segurança
Abertura pública por função de backend que aceite apenas campos permitidos e imponha status Aberto; leitura e atualização restritas ao administrador por RLS; não permitir autoatribuição de privilégio; não expor secrets ou dados pessoais. Sem login de clientes. Login administrativo com senha gerida pelo provedor de autenticação; administrador configurado de maneira explícita. Proteção contra abuso do endpoint público quando viável.

## Administração
Indicadores reais (total, abertos, em andamento, concluídos); listagem por data, busca por nome/número/assunto e filtro por status. Detalhes exibem todos os campos. Administrador pode alterar status, salvar observações internas e abrir `wa.me` com mensagem pré-preenchida. Não excluir registros.

## Identidade visual
Azul `#2563EB`, azul escuro `#0F172A`, fundo `#F8FAFC`, branco `#FFFFFF`, verde `#10B981`, vermelho `#EF4444`, cinza `#64748B`. Fonte Inter, ícones Lucide, layout claro, mobile-first, sem fotos ou imagens de IA.

## Não implementar
Multiempresa, cadastro de técnicos, pagamentos, assinaturas, notificações, APIs WhatsApp, chat, anexos, SLA, relatórios complexos, IA, calendários, dados demonstrativos falsos, tema escuro.

## Critérios de aceite
Navegação pública; validações; inserção real; bloqueio de leitura pública; login autorizado; dashboard real; alterações persistentes; botão WhatsApp correto; responsividade; README básico; ausência de secrets versionados. Informar apenas testes de fato executados e eventuais configurações manuais.
