# ChamadoFácil

**Seus chamados organizados, seu atendimento simplificado.**

MVP acadêmico para validar uma ideia de negócio: oferecer a profissionais autônomos e pequenas empresas de suporte de TI uma forma simples de receber, organizar e acompanhar solicitações de atendimento técnico.

## Problema
Pedidos de suporte chegam espalhados (WhatsApp, ligações, recados) e se perdem. O ChamadoFácil centraliza a abertura de chamados em um formulário público e organiza tudo em um painel.

## Público-alvo
Técnicos de TI autônomos e pequenas empresas de suporte técnico.

## Funcionalidades implementadas
- Landing page pública (`/`).
- Formulário público de abertura de chamado (`/abrir-chamado`) com validação no navegador e no servidor, máscara de WhatsApp, consentimento obrigatório e confirmação com número `CF-000001`.
- Login administrativo por e-mail e senha (`/login`).
- Painel protegido (`/admin`): indicadores reais, listagem, pesquisa, filtro por status, detalhes em painel lateral, alteração de status, observações internas e botão de contato pelo WhatsApp (`wa.me`, sem envio automático).

## Tecnologias
TanStack Start (React 19), Tailwind CSS v4, ícones Lucide, Lovable Cloud (banco de dados PostgreSQL + autenticação).

## Modelo de dados
- `chamados`: id, numero (identity), nome, whatsapp (só dígitos), email, categoria, assunto, descricao, status, observacoes_internas, created_at, updated_at. Restrições de formato, categoria e status no banco; `updated_at` por trigger; somente status e observações podem ser alterados pelo admin.
- `admin_users`: lista privada dos usuários com acesso administrativo.
- `chamados_rate_limit`: controle de frequência (máx. 5 chamados a cada 10 minutos por origem, guardada como hash).

## Segurança
- RLS: anônimos não leem, alteram nem excluem chamados; apenas usuários presentes em `admin_users` leem e atualizam.
- Criação pública via função de servidor `criarChamado` → função do banco `criar_chamado`, executável somente com credencial de servidor. Campos internos enviados pelo público são ignorados; status inicial sempre "Aberto".
- Nenhuma chave privilegiada no navegador ou no repositório.

## Configuração do administrador
1. No Lovable, abra **Cloud → Users → Add user → Create new user** e crie a conta (e-mail e senha).
2. Copie o ID (UUID) do usuário criado.
3. Em **Cloud → Database**, execute: `insert into public.admin_users (user_id) values ('<UUID>');`
4. Acesse `/login` com essa conta.

Contas sem registro em `admin_users` recebem "Acesso negado".

## Limitações conhecidas
- O limite de frequência usa o IP informado pela infraestrutura; não substitui um CAPTCHA.
- A listagem carrega os 500 chamados mais recentes (sem paginação).
- O cadastro público de contas não é oferecido pela interface; recomenda-se desativar inscrições em Cloud → Users → Auth settings.

## Evolução prevista
Consulta pública de chamados, histórico de eventos, múltiplos técnicos, notificações.

## A preencher
- TAM / SAM / SOM:
- Business Model Canvas:
- Histórico de prompts:
- URL publicada:
- Capturas de tela:
