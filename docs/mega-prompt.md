# ChamadoFácil — Mega Prompt para Construção do MVP

## 1. Objetivo e instruções gerais

Crie uma aplicação web full-stack chamada **ChamadoFácil**, em português do Brasil (pt-BR), com o slogan:

**"Seus chamados organizados, seu atendimento simplificado."**

O ChamadoFácil é um MVP acadêmico para validar uma ideia de negócio: oferecer a profissionais autônomos e pequenas empresas de suporte de TI uma maneira simples de receber, organizar e acompanhar solicitações de atendimento técnico.

**Implemente uma aplicação realmente funcional, e não apenas uma interface demonstrativa.**

Use o backend nativo do **Lovable Cloud**, incluindo banco de dados, autenticação e funções de backend quando necessárias.

### Diretrizes prioritárias

1. Implemente todos os fluxos essenciais nesta execução, evitando etapas de planejamento ou confirmações adicionais desnecessárias.
2. Utilize as tecnologias, bibliotecas e componentes já disponíveis no ambiente do Lovable, priorizando simplicidade e manutenção.
3. Não utilize Supabase externo, Firebase, banco de dados próprio ou serviços pagos adicionais.
4. Não gere imagens por IA. Utilize ícones vetoriais Lucide e elementos visuais em CSS.
5. Evite funcionalidades que não estejam explicitamente solicitadas.
6. Priorize backend funcional, segurança, usabilidade e responsividade, nesta ordem.
7. Não utilize dados fictícios como se fossem registros reais.
8. Não implemente integrações de pagamento, envio de e-mails, inteligência artificial ou API externa do WhatsApp.
9. Utilize componentes reutilizáveis e uma estrutura de código simples.
10. Não deixe botões sem funcionalidade nem funcionalidades simuladas.
11. Ao concluir, informe apenas o que foi efetivamente implementado, eventuais limitações e passos manuais necessários para configuração.

**Critério central de sucesso:** um visitante deve conseguir abrir um chamado real, esse registro deve persistir no Lovable Cloud e um administrador autenticado e autorizado deve conseguir visualizá-lo, atualizar seu status e contatar o cliente pelo WhatsApp.

---

## 2. Identidade visual

Crie uma identidade moderna, limpa e profissional, semelhante à de uma plataforma SaaS.

### Cores

- Azul primário: `#2563EB`
- Azul escuro: `#0F172A`
- Fundo claro: `#F8FAFC`
- Branco: `#FFFFFF`
- Verde de sucesso: `#10B981`
- Vermelho de erro: `#EF4444`
- Cinza para textos secundários: `#64748B`

### Estilo

- Layout mobile-first, adaptável para desktop, tablet e celular.
- Fonte Inter ou equivalente disponível.
- Cards com cantos suavemente arredondados.
- Sombras discretas e espaçamento consistente.
- Botões com estados visuais de foco, carregamento e desabilitado.
- Animações mínimas e discretas.
- Utilizar ícones Lucide.
- Logotipo textual "ChamadoFácil", acompanhado de um ícone simples relacionado a chamados ou suporte técnico.
- Tema claro como padrão. Não implementar alternância para tema escuro.
- Não utilizar fotografias, imagens geradas ou bibliotecas visuais desnecessárias.

Toda a interface, inclusive mensagens de erro, validação e estados vazios, deverá estar em português do Brasil.

---

## 3. Estrutura da aplicação

Crie quatro rotas principais:

- `/` — Landing page pública.
- `/abrir-chamado` — Formulário público de abertura.
- `/login` — Autenticação administrativa.
- `/admin` — Painel administrativo protegido.

A visualização detalhada de um chamado poderá ser implementada em `/admin/chamados/:id` ou em um modal/drawer dentro do painel, adotando a alternativa mais simples e consistente.

Não criar outras páginas sem necessidade.

---

## 4. Landing page pública

Desenvolva uma página de apresentação do ChamadoFácil.

### Cabeçalho

- Logotipo textual ChamadoFácil.
- Link "Início".
- Link ou botão "Abrir chamado".
- Link discreto "Área administrativa", direcionando para `/login`.

### Seção principal (hero)

Título:

**"Precisa de suporte técnico? Abra seu chamado em poucos minutos."**

Subtítulo:

"Descreva seu problema, envie sua solicitação e deixe que nossa equipe entre em contato para ajudar."

Botão principal:

**"Abrir chamado"**

O botão deve navegar para `/abrir-chamado`.

### Seção "Como funciona"

Apresente três etapas:

1. **Descreva o problema:** informe seus dados e o serviço necessário.
2. **Envie sua solicitação:** seu chamado será registrado de forma organizada.
3. **Aguarde o contato:** o responsável pelo atendimento entrará em contato para dar continuidade.

### Seção de categorias

Exiba cinco categorias de atendimento com ícones:

- Computadores e notebooks.
- Redes e internet.
- Impressoras e periféricos.
- Software e sistemas.
- Outros serviços de TI.

### Rodapé

- Nome ChamadoFácil.
- Descrição curta: "Gestão simplificada de solicitações de suporte técnico."
- Texto informando que se trata de um projeto demonstrativo de MVP, sem compromisso de atendimento comercial real.
- Link para abertura de chamado.
- Link discreto para área administrativa.

Não inventar avaliações de clientes, depoimentos, quantidade de usuários, empresas atendidas ou resultados comerciais.

---

## 5. Formulário de abertura de chamado

Rota: `/abrir-chamado`

Criar um formulário simples, acessível e responsivo.

### Campos

**Nome completo**
- Texto.
- Obrigatório.
- Mínimo de 3 e máximo de 120 caracteres.

**WhatsApp**
- Telefone brasileiro com DDD.
- Obrigatório.
- Máscara amigável.
- Armazenar somente dígitos.
- Validar números brasileiros de 10 ou 11 dígitos com DDD.

**E-mail**
- Texto com validação de e-mail.
- Opcional.
- Máximo de 254 caracteres.

**Categoria**
- Seleção obrigatória.
- Opções:
  - Computadores e notebooks.
  - Redes e internet.
  - Impressoras e periféricos.
  - Software e sistemas.
  - Outros.

**Assunto**
- Texto.
- Obrigatório.
- Mínimo de 5 e máximo de 150 caracteres.

**Descrição do problema**
- Área de texto.
- Obrigatória.
- Mínimo de 10 e máximo de 2000 caracteres.

### Privacidade

Incluir texto claro e objetivo explicando que os dados fornecidos serão usados para registrar a solicitação e permitir contato referente ao atendimento.

Adicionar checkbox obrigatório:

"Estou ciente de que meus dados serão utilizados para registrar esta solicitação e permitir o contato sobre o atendimento."

Não solicitar CPF, endereço residencial ou outros dados pessoais desnecessários.

### Comportamento

- Validar campos antes do envio.
- Revalidar integralmente os dados no backend.
- Desabilitar temporariamente o botão durante o envio para evitar duplicações acidentais.
- Exibir erros amigáveis e específicos quando necessário.
- Preservar os dados preenchidos em caso de erro.
- Não considerar uma solicitação concluída antes da confirmação do backend.
- Após o sucesso, mostrar uma tela ou card de confirmação com:
  - Mensagem: "Chamado aberto com sucesso!"
  - Número identificador do chamado.
  - Texto: "Sua solicitação foi registrada. O responsável pelo atendimento poderá entrar em contato pelo WhatsApp informado."
  - Botão "Voltar ao início".
- Limpar os dados somente após o envio confirmado.

Não criar login para o solicitante.

Não implementar consulta pública de chamados nesta versão.

---

## 6. Modelo de dados

Utilizar o banco de dados nativo do Lovable Cloud.

Criar uma tabela principal `chamados`, com os campos:

| Campo | Tipo sugerido | Descrição |
|---|---|---|
| id | UUID | Identificador interno, chave primária |
| numero | BIGINT identity/sequence | Número sequencial único do chamado |
| nome | VARCHAR(120) | Nome do solicitante |
| whatsapp | VARCHAR(11) | Telefone com DDD, somente dígitos |
| email | VARCHAR(254), nullable | E-mail opcional |
| categoria | TEXT ou enum | Categoria do atendimento |
| assunto | VARCHAR(150) | Resumo da solicitação |
| descricao | TEXT | Descrição detalhada |
| status | TEXT ou enum | Estado atual |
| observacoes_internas | TEXT, nullable | Anotações administrativas |
| created_at | TIMESTAMPTZ | Data de abertura |
| updated_at | TIMESTAMPTZ | Última alteração |

### Regras do banco

- `id` gerado automaticamente.
- `numero` gerado automaticamente, único e sem dependência de consultas ao maior número existente.
- Apresentar o número com formato `CF-000001`, `CF-000002` e assim sucessivamente, com preenchimento de zeros na interface.
- `created_at` gerado pelo banco.
- `updated_at` atualizado automaticamente quando houver alteração.
- Status inicial `Aberto`.
- Validar status, categoria e campos essenciais também no backend/banco.
- Criar índices simples nos campos relevantes para filtros e ordenação, se necessário.
- Não criar tabelas separadas de clientes, empresas, técnicos, pagamentos, notificações ou histórico de eventos.

### Status permitidos

- `Aberto`
- `Em andamento`
- `Concluído`
- `Cancelado`

Os status poderão ser alterados pelo administrador entre quaisquer desses estados, inclusive reabrindo um chamado concluído ou cancelado.

### Observações

O campo `observacoes_internas` será um único texto editável pelo administrador, limitado a 5000 caracteres.

Não implementar um histórico completo de comentários nesta versão.

---

## 7. Autenticação e autorização administrativa

Utilizar a autenticação nativa do Lovable Cloud.

### Login

Rota: `/login`

Criar formulário contendo:

- E-mail.
- Senha.
- Botão "Entrar".
- Mensagens amigáveis de erro.
- Indicador de carregamento.
- Redirecionamento para `/admin` após autenticação e autorização bem-sucedidas.

Não implementar cadastro público de administradores, recuperação personalizada de senha ou login social.

### Autorização

Este MVP possui apenas um administrador.

Implementar autorização segura, preferencialmente por uma pequena tabela privada `admin_users` contendo o identificador do usuário autenticado autorizado.

Requisitos:

- A existência de uma conta autenticada não deve, por si só, conceder acesso administrativo.
- Apenas um usuário explicitamente incluído como administrador poderá acessar os chamados.
- Nenhum cadastro público poderá conceder a si mesmo privilégios administrativos.
- O identificador autorizado não deve ser controlado por parâmetros do navegador nem por metadados editáveis pelo próprio usuário.
- Não inserir senha, token, credenciais ou chave privilegiada no código.
- Proteger `/admin` e as rotas internas tanto no frontend quanto nas políticas do backend.
- Um usuário autenticado sem autorização deverá receber acesso negado.
- Implementar logout e encerramento da sessão.

### Configuração inicial

Não inventar credenciais de administrador.

Utilizar a abordagem mais simples e segura suportada pelo Lovable Cloud para permitir que o proprietário configure manualmente a primeira conta e conceda a ela o papel administrativo.

Se essa etapa exigir configuração pelo console do Lovable Cloud, deixe-a documentada de forma clara e objetiva ao concluir.

Não implementar bootstrap administrativo inseguro, como atribuir o papel de administrador automaticamente ao primeiro visitante.

---

## 8. Segurança dos dados e formulário público

Esta seção é obrigatória.

### Políticas de acesso

Aplicar Row Level Security (RLS) ou mecanismo equivalente do Lovable Cloud para garantir que:

- Visitantes anônimos não possam consultar chamados diretamente.
- Visitantes anônimos não possam atualizar ou excluir chamados.
- Usuários autenticados sem autorização administrativa não possam consultar ou alterar chamados.
- Somente o administrador autorizado possa listar, consultar e atualizar registros.
- A tabela `admin_users` não exponha dados ou operações de gerenciamento a visitantes ou usuários comuns.

### Criação pública de chamados

Preferir uma função de backend/Edge Function chamada `criar-chamado` como ponto de entrada para o formulário público.

A função deverá:

1. Aceitar apenas os campos públicos previstos.
2. Validar tipos, comprimentos, formatos e valores permitidos.
3. Ignorar qualquer tentativa de definir `id`, `numero`, `status`, `observacoes_internas`, datas ou permissões.
4. Impor o status inicial `Aberto`.
5. Inserir o chamado com segurança utilizando credenciais exclusivamente no backend.
6. Retornar apenas sucesso e o número público do chamado.
7. Não retornar dados pessoais do registro.
8. Tratar falhas sem expor mensagens internas, SQL, credenciais ou detalhes de infraestrutura.

Impedir inserção direta anônima na tabela caso a função de backend seja utilizada.

Aplicar proteção simples contra abuso, como limitação de frequência de requisições por origem, se houver mecanismo confiável disponível. Não confiar apenas em um campo oculto ou limitação no frontend.

Não adicionar serviços externos de CAPTCHA ou dependências pagas apenas para esta proteção. Caso uma proteção adequada contra abuso dependa de configuração adicional, documentar a limitação e não afirmar que ela já está resolvida.

Não expor chaves privilegiadas no frontend, em variáveis `VITE_` ou no repositório.

Não utilizar `localStorage` como banco de dados dos chamados.

---

## 9. Painel administrativo

Rota: `/admin`

Acesso exclusivo ao administrador autenticado e autorizado.

Criar uma interface limpa e responsiva com:

### Cabeçalho administrativo

- Logotipo ChamadoFácil.
- Título "Painel administrativo".
- Identificação simples do usuário conectado.
- Botão "Sair".

### Indicadores

Quatro cards com contagens reais do banco:

1. Total de chamados.
2. Chamados abertos.
3. Chamados em andamento.
4. Chamados concluídos.

Não utilizar números fixos ou simulados.

Os indicadores devem ser atualizados após alterações relevantes.

### Listagem de chamados

Exibir:

- Número do chamado.
- Data de abertura, em formato brasileiro.
- Nome do cliente.
- Assunto.
- Categoria.
- Status.
- Ação "Ver detalhes".

Ordenar inicialmente pelos chamados mais recentes.

### Recursos da listagem

- Pesquisa textual por número do chamado, nome do cliente ou assunto.
- Filtro por status.
- Opção "Todos" para visualizar todos os status.
- Estado vazio amigável quando não houver registros.
- Indicador de carregamento.
- Mensagens amigáveis para falhas na consulta.
- Botão para atualizar a listagem, se necessário.
- Layout adaptado para celulares, podendo utilizar cards no lugar da tabela.

Não implementar paginação complexa. Uma listagem simples com carregamento limitado e ordenação adequada é suficiente para o MVP.

---

## 10. Detalhes e gerenciamento do chamado

Ao selecionar um chamado, exibir uma página, modal ou drawer com:

- Número do chamado.
- Data de abertura.
- Última atualização.
- Nome do solicitante.
- WhatsApp.
- E-mail, caso informado.
- Categoria.
- Assunto.
- Descrição completa.
- Status atual.
- Campo editável "Observações internas".

### Ações administrativas

**Alterar status**

Permitir selecionar um dos quatro status e salvar a alteração no banco de dados.

**Salvar observações**

Permitir editar e persistir as observações internas.

**Entrar em contato pelo WhatsApp**

Criar um botão que abra o WhatsApp Web ou aplicativo utilizando `https://wa.me/` e o número brasileiro normalizado com código internacional `55`.

Utilizar uma mensagem pré-preenchida semelhante a:

"Olá, [nome]! Estou entrando em contato sobre seu chamado [número], referente a [assunto]."

Construir a URL com codificação adequada dos parâmetros.

Não enviar mensagens automaticamente.

**Voltar**

Permitir retornar à listagem sem perder filtros, sempre que for simples manter esse comportamento.

### Requisitos de persistência

- Toda alteração deverá ser gravada no backend.
- Exibir confirmação somente depois do sucesso da gravação.
- Atualizar os indicadores e a listagem.
- Tratar falhas mantendo o usuário informado.
- Impedir gravações duplicadas por cliques repetidos.
- Não criar funcionalidade de exclusão de chamados.

---

## 11. Experiência de uso

Implementar os seguintes cuidados:

- Todas as ações relevantes devem apresentar feedback visual.
- Evitar erros silenciosos.
- Validar campos com mensagens específicas.
- Utilizar elementos semânticos e labels associados aos campos.
- Garantir navegação por teclado e foco visível.
- Proteger contra envios repetidos.
- Garantir responsividade em telas pequenas.
- Exibir datas no padrão `dd/MM/yyyy HH:mm`, usando o fuso `America/Sao_Paulo` para apresentação, mantendo armazenamento adequado em UTC.
- Manter textos consistentes em português do Brasil.
- Criar telas vazias agradáveis, sem exemplos falsos no banco.

Não implementar funcionalidades apenas decorativas.

---

## 12. Limites de escopo

**Não implementar nesta versão:**

- SaaS multiempresa.
- Cadastro ou gerenciamento de técnicos.
- Papéis adicionais ou permissões complexas.
- Cadastro e login de clientes.
- Histórico público de chamados.
- Chat interno.
- Envio automático de mensagens pelo WhatsApp.
- Integração com API do WhatsApp Business.
- Notificações por e-mail.
- Resend, Stripe ou outras APIs de terceiros.
- Planos de pagamento ou assinaturas.
- Upload de arquivos e imagens.
- Integração com inteligência artificial.
- Prioridade, SLA ou escalonamento de chamados.
- Calendário e agendamentos.
- Histórico avançado de eventos.
- Relatórios analíticos complexos.
- Exportação de arquivos.
- Painel de configurações desnecessário.
- Temas múltiplos.
- Dados de demonstração inseridos automaticamente.

O objetivo é entregar um MVP pequeno, completo e seguro.

---

## 13. Organização e documentação

Organizar o código de maneira simples, utilizando componentes reaproveitáveis para:

- Layout público.
- Layout administrativo.
- Formulário de chamados.
- Indicadores de status.
- Listagem de chamados.
- Visualização e edição de detalhes.
- Controle de autenticação e autorização.
- Acesso ao backend.

Evitar abstrações desnecessárias e engenharia excessiva.

Criar ou atualizar o `README.md` com:

- Nome do produto.
- Objetivo do projeto.
- Problema que pretende resolver.
- Público-alvo.
- Funcionalidades implementadas.
- Tecnologias utilizadas.
- Principais rotas.
- Modelo de dados.
- Orientações de autenticação e configuração do administrador.
- Instruções básicas de execução e configuração, quando aplicáveis.
- Limitações conhecidas.
- Funcionalidades previstas para evolução.
- Espaços identificados para acrescentar posteriormente TAM/SAM/SOM, Business Model Canvas, histórico de prompts, URL publicada e capturas de tela.

Não inventar estatísticas de mercado, validações com clientes, links de GitHub ou URL de produção.

Preparar o código para posterior sincronização com um repositório GitHub público chamado `chamadofacil`.

Não versionar credenciais, secrets, tokens ou senhas.

---

## 14. Critérios de aceite obrigatórios

Antes de considerar a implementação concluída, verificar os seguintes cenários:

**Cenário 1 — Navegação pública**
- A landing page carrega corretamente.
- O botão "Abrir chamado" abre o formulário.
- O site funciona em desktop e celular.

**Cenário 2 — Validação do formulário**
- Campos obrigatórios são validados.
- WhatsApp inválido é rejeitado.
- Categoria inválida é rejeitada.
- O botão de envio apresenta estado de carregamento.

**Cenário 3 — Abertura de chamado**
- Um visitante anônimo consegue criar um chamado válido.
- O registro é persistido no Lovable Cloud.
- O chamado recebe número único, data automática e status "Aberto".
- A confirmação mostra o número correto.

**Cenário 4 — Segurança**
- Visitantes anônimos não conseguem listar chamados.
- Usuários comuns não conseguem acessar dados administrativos.
- Acesso direto a `/admin` sem autorização é bloqueado.
- Tentativas de definir status ou campos internos pelo formulário público não são aceitas.
- As políticas de acesso ao banco protegem efetivamente os dados.

**Cenário 5 — Administração**
- O administrador autorizado consegue fazer login.
- Os indicadores apresentam contagens reais.
- Os chamados são listados corretamente.
- Pesquisa e filtros funcionam.
- Os detalhes completos podem ser visualizados.

**Cenário 6 — Atualização**
- O administrador consegue alterar o status.
- O administrador consegue salvar observações internas.
- As alterações persistem após atualizar a página.
- O dashboard reflete as mudanças.

**Cenário 7 — WhatsApp**
- O botão abre o contato correto.
- O número contém o código internacional adequado.
- A mensagem inclui nome, número e assunto do chamado.

**Cenário 8 — Finalização**
- O aplicativo não apresenta erros graves de compilação.
- As rotas essenciais funcionam.
- Não há dados falsos apresentados como reais.
- O README descreve a implementação efetiva.
- O projeto está preparado para publicação e integração com GitHub.

Execute as verificações que forem possíveis no ambiente, distinguindo claramente testes executados de verificações que dependem de intervenção humana.

---

## 15. Orientação final

Construa o ChamadoFácil como **um MVP funcional e pronto para ser testado**, priorizando:

1. Banco de dados e segurança.
2. Abertura pública de chamados.
3. Autenticação e autorização administrativa.
4. Listagem e gerenciamento de chamados.
5. Integração simples com WhatsApp.
6. Identidade visual e responsividade.
7. Documentação básica.

Não ampliar o escopo com funcionalidades não solicitadas.

Caso alguma configuração dependa de ação manual minha, não substitua essa etapa por uma solução insegura. Implemente a estrutura correta e forneça instruções exatas para concluir a configuração.

Ao final, apresente um resumo objetivo das funcionalidades concluídas, eventuais pendências, procedimentos para configurar o administrador e os testes que realmente foram realizados.

**O resultado deve ser uma aplicação real, com persistência, segurança e interface utilizável, adequada à publicação como projeto de portfólio.**
