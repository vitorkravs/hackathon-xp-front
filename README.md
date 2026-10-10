# XP Open Finance — plataforma do assessor

Front-end criado para o Hackathon XP. A plataforma reúne clientes, carteiras, conexões e análises de risco em uma interface para apoiar o trabalho do assessor de investimentos.

> **Versão publicada:** [hackathon-xp-front.vercel.app](https://hackathon-xp-front.vercel.app/). Você pode explorar a aplicação sem instalar o projeto. O acesso usa a conta fictícia descrita abaixo.

Este repositório é um protótipo independente e **não é um produto oficial da XP**. Clientes, saldos, posições, conexões e análises são fictícios. Ainda não há backend .NET nem integração real com Pluggy ou Open Finance.

## Tecnologias

| Tecnologia                | Uso no projeto                                              |
| ------------------------- | ----------------------------------------------------------- |
| Next.js 16 (App Router)   | Páginas, layouts, rotas de API e renderização no servidor   |
| React 19 + TypeScript     | Componentes e contratos tipados                             |
| CSS                       | Estilos responsivos, identidade visual e temas claro/escuro |
| Motion                    | Transições e animações da interface                         |
| Lucide React              | Ícones da navegação e dos componentes                       |
| ESLint + Prettier         | Análise estática e formatação                               |
| tsx + Node.js Test Runner | Testes da simulação de dados e riscos                       |

As versões exatas das dependências estão em [`package.json`](package.json) e [`package-lock.json`](package-lock.json).

## Rodar localmente

### Pré-requisitos

- Node.js **20.9 ou superior** (requisito da versão do Next.js instalada).
- npm e acesso à internet para instalar as dependências.

Na pasta raiz do projeto, execute:

```bash
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O comando `npm ci` usa o lockfile e instala as versões registradas. Se a porta 3000 estiver ocupada, inicie em outra porta:

```bash
npm run dev -- -p 3001
```

Não é necessário configurar banco de dados, serviço de e-mail, Pluggy ou backend para executar o cenário local. Sem variáveis de ambiente, a rota de análises usa a simulação incluída no repositório.

### Conta de acesso

| Campo         | Valor                  |
| ------------- | ---------------------- |
| E-mail        | `assessor@xp-demo.com` |
| Senha inicial | `XPdemo@2026`          |

O login é **mockado**: a sessão usa o cookie `xp-demo-session`, e a opção “Manter conectado por 7 dias” define sua duração. O logout remove o cookie. A recuperação de senha cria um link de uso único, válido por 15 minutos, exibido na própria página; nenhum e-mail é enviado. A senha redefinida é salva apenas no armazenamento local do navegador em que a ação foi feita. Para voltar à senha inicial nesse navegador, remova os dados locais do site.

Esse fluxo serve para navegação no protótipo e não deve proteger dados reais.

### Build de produção local

Para validar e executar a versão compilada:

```bash
npm run build
npm run start
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000). Encerre `npm run dev` antes de usar a mesma porta para `npm run start`.

## Funcionalidades e rotas

| Rota                       | Conteúdo                                                                      |
| -------------------------- | ----------------------------------------------------------------------------- |
| `/`                        | Login do assessor                                                             |
| `/esqueceu-sua-senha`      | Criação local do link de recuperação                                          |
| `/recuperar-senha/[token]` | Redefinição da senha mockada                                                  |
| `/dashboard`               | Indicadores e visão geral da carteira fictícia                                |
| `/clientes`                | Busca, filtros, aniversários do mês, exportação CSV e convite ilustrativo     |
| `/clientes/[id]`           | Cadastro, aviso de aniversário, carteira, FGC, crédito, vencimentos e alertas |
| `/conexoes`                | Visão dos consentimentos e conexões simuladas                                 |
| `/oportunidades`           | Oportunidades de acompanhamento ilustrativas                                  |

As rotas de assessor exigem o cookie da sessão mockada. A interface oferece tema claro/escuro, sidebar recolhível e escolha entre ícones animados ou estáticos. Essas preferências ficam no navegador. As animações respeitam a preferência de movimento reduzido do sistema.

Os avisos de aniversário mostram clientes que fazem aniversário hoje ou ainda neste mês. As datas são calculadas pelo calendário de São Paulo; dois cadastros fictícios têm aniversários em outubro para facilitar a visualização do recurso.

## Organização do código

```text
app/
  (public)/                    Login e recuperação de senha
  (authenticated)/             Layout e módulos da área do assessor
    dashboard/
    clientes/
      [id]/                    Detalhes e painéis de análise
    conexoes/
    oportunidades/
    components/                Componentes compartilhados
  api/clientes/               API local da listagem
    [id]/                     API local do cliente por ID
      analises/               API local das análises
  globals.css                  Estilos e temas
lib/
  mock-auth.ts                 Conta e sessão locais
  mock-data.ts                 Clientes e indicadores fictícios
  mock-client-requests.ts      Consultas assíncronas simuladas
  mock-positions.ts            Posições fictícias por cliente
  mock-analyses.ts             Cálculos simulados de FGC, score e alertas
  analysis-contract.ts         Tipos e validação da resposta de análise
public/                        Logo e arquivos estáticos
proxy.ts                       Redirecionamento das rotas protegidas
tests/                         Testes da simulação
```

Os módulos da sidebar têm suas próprias `page.tsx`. O layout autenticado compartilha navegação e preferências visuais; os componentes específicos do cliente ficam em `app/(authenticated)/clientes/[id]`.

## Dados, análises e integração

A listagem consulta `GET /api/clientes`, com uma latência curta simulada e estados de carregamento e erro. Ao abrir `/clientes/[id]`, a página consulta `GET /api/clientes/{id}` e apresenta um esqueleto enquanto aguarda a resposta. A API de detalhe devolve cadastro, posições e indicadores básicos. Essas consultas usam os mesmos dados mockados e ainda não acessam um backend externo.

A página do cliente também chama `GET /api/clientes/{id}/analises`. Hoje, essa rota calcula uma resposta local a partir dos clientes e posições fictícios. Os painéis de FGC e crédito apenas exibem o resultado recebido: regras de elegibilidade, agrupamento por conglomerado e cálculo do score ficam na API local.

- **FGC:** agrupa posições potencialmente elegíveis por cliente e conglomerado e mostra exposição, parcela sob o limite ordinário e excesso potencial. Os valores dependem de confirmar titularidade, conglomerado, produto, saldo e histórico de garantias; excesso potencial **não é perda prevista**.
- **Crédito privado:** apresenta uma nota fictícia para o **emissor**, composta por seis fatores com pesos e fontes visíveis. A nota não é rating oficial, não mede probabilidade de inadimplência e não substitui a avaliação da emissão, da concentração da carteira ou da adequação ao perfil do cliente.
- **Vencimentos:** usa a data atual no fuso de São Paulo para calcular os dias restantes; mostra faixas de até 30, 31 a 60 e 61 a 90 dias, com posições ordenadas pela data.
- **Alertas:** são ordenados por gravidade e informam motivo, origem e próxima ação verificável.

As posições da simulação têm data-base `2026-10-10`. O cálculo de prazo é atualizado a cada acesso, mas os saldos da carteira continuam sendo um retrato fictício dessa data. Os indicadores gerais do dashboard também são ilustrativos e não representam dados reais da Pluggy.

### Variáveis de ambiente opcionais

Crie um arquivo `.env.local` na raiz somente se precisar alterar o comportamento padrão:

```dotenv
# Fração do patrimônio por emissor que dispara o alerta; padrão: 0.15
SIMULATION_CONCENTRATION_THRESHOLD=0.15

# Configure apenas quando existir uma API externa compatível.
# ANALYSIS_API_BASE_URL=http://localhost:5000/
```

| Variável                             | Comportamento                                                                                                           |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `SIMULATION_CONCENTRATION_THRESHOLD` | Limite de concentração da simulação local; aceita fração maior que 0 e até 1. Valor padrão: `0.15` (15%).               |
| `ANALYSIS_API_BASE_URL`              | Quando definida, a rota Next.js consulta `GET {base}/clientes/{id}/analises`. Sem essa variável, usa a simulação local. |

A resposta de uma futura API deve seguir [`lib/analysis-contract.ts`](lib/analysis-contract.ts). Se a API externa falhar ou retornar dados inválidos, a tela informa a indisponibilidade da análise; não há substituição silenciosa por dados fictícios. A rota usa a sessão local do protótipo, portanto uma integração real também precisará de autenticação e autorização próprias.

## Qualidade e comandos úteis

| Comando                | Finalidade                                          |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento                |
| `npm run build`        | Compila e verifica os tipos para produção           |
| `npm run start`        | Inicia a versão já compilada                        |
| `npm test`             | Testa patrimônio, FGC, score, alertas e vencimentos |
| `npm run lint`         | Executa o ESLint                                    |
| `npm run format`       | Formata os arquivos de código                       |
| `npm run format:check` | Confere a formatação do código sem alterar arquivos |

Antes de enviar alterações, execute:

```bash
npm test
npm run lint
npm run format:check
npm run build
```

## Limites atuais

- Não há backend .NET, banco de dados ou integração real com Open Finance/Pluggy.
- Login, consentimentos, convites, conexões, clientes e posições são simulações. O convite não envia e-mail.
- A redefinição de senha vale apenas no navegador que criou o link.
- Análises financeiras usam valores fictícios e não devem embasar recomendações ou decisões sobre clientes reais.

O projeto utiliza uma identidade visual inspirada na XP. A marca está em [`public/xp-logo.svg`](public/xp-logo.svg).
