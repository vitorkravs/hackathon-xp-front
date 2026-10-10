# XP Open Finance — plataforma do assessor

Protótipo front-end para o Hackathon XP. A interface reúne uma visão geral da carteira, lista de clientes, acompanhamento de consentimentos e oportunidades de conversa para apoiar uma assessoria mais personalizada.

## Executar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). A entrada fica em `/`. As áreas protegidas têm rotas próprias: `/dashboard`, `/clientes`, `/conexoes` e `/oportunidades`.

Para manter a indentação e a formatação do código, execute `npm run format`. Use `npm run format:check` para verificar sem alterar arquivos.

## Acesso local

- **E-mail:** `assessor@xp-demo.com`
- **Senha inicial:** `XPdemo@2026`

O fluxo inclui login, opção de manter a sessão por sete dias, logout, recuperação de acesso e redefinição de senha. Na tela “Esqueceu sua senha?”, informe o e-mail acima: o link temporário será exibido na própria interface, sem envio de e-mail. A nova senha fica salva apenas no armazenamento local deste navegador.

## O que está disponível

- Painel responsivo com indicadores e evolução ilustrativa de patrimônio.
- Busca e filtro de clientes, detalhes pessoais e financeiros, alocação e status do consentimento.
- Visão de conexões Open Finance e oportunidades de acompanhamento.
- Exportação CSV dos clientes filtrados.
- Fluxo demonstrativo de convite de cliente.

## Dados e integração

Todos os nomes, e-mails, valores e insights exibidos são **fictícios**. Os indicadores do painel representam um cenário ilustrativo e não são calculados a partir dos seis clientes de exemplo. A ação de convite não envia e-mail e a solicitação de atualização de consentimento não chama serviços externos.

**A autenticação também é mockada.** O cookie de sessão e a senha redefinida são controlados pelo navegador, sem backend ou verificação de identidade real. Não use este fluxo para proteger dados verdadeiros. Para operar com dados reais, o próximo passo é integrar um provedor de identidade, APIs de um participante/provedor Open Finance, consentimento explícito do cliente, gestão de escopos e expiração, e controles adequados de acesso e auditoria. Nenhum dado financeiro real deve ser colocado nos objetos de demonstração do front-end.

## Identidade visual

O protótipo usa a marca XP e uma paleta de preto, branco e amarelo. O arquivo [`public/xp-logo.svg`](public/xp-logo.svg) reproduz o logotipo publicado pela XP em seu CDN, disponibilizado também no [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Logotipo_da_XP_Investimentos.svg).

Projeto de demonstração criado para o Hackathon XP; não é um produto oficial da XP.
