"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/mock-auth";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  Filter,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";

type Section = "overview" | "clients" | "connections" | "insights";
const routes: Record<Section, string> = {
  overview: "/dashboard",
  clients: "/clientes",
  connections: "/conexoes",
  insights: "/oportunidades",
};
type Consent = "Ativo" | "Pendente" | "Expirando";
type Client = {
  id: number;
  name: string;
  initials: string;
  email: string;
  profile: string;
  assets: number;
  change: number;
  institutions: number;
  consent: Consent;
  color: string;
  opportunity: string;
  allocation: { label: string; value: number; color: string }[];
};

// Fonte local temporária até a integração com as APIs de clientes e Open Finance.
const clients: Client[] = [
  {
    id: 1,
    name: "Mariana Costa",
    initials: "MC",
    email: "mariana.costa@exemplo.com",
    profile: "Moderado",
    assets: 2840000,
    change: 8.4,
    institutions: 3,
    consent: "Ativo",
    color: "#d8c5b3",
    opportunity: "Concentração elevada em renda fixa. Vale revisar a diversificação.",
    allocation: [
      { label: "Renda fixa", value: 58, color: "#f6c945" },
      { label: "Fundos", value: 24, color: "#181818" },
      { label: "Ações", value: 18, color: "#9c9c9c" },
    ],
  },
  {
    id: 2,
    name: "Ricardo Almeida",
    initials: "RA",
    email: "ricardo.almeida@exemplo.com",
    profile: "Arrojado",
    assets: 1950000,
    change: 12.2,
    institutions: 4,
    consent: "Ativo",
    color: "#b7c6c0",
    opportunity: "Saldo disponível fora da XP pode apoiar novos objetivos.",
    allocation: [
      { label: "Ações", value: 45, color: "#f6c945" },
      { label: "Fundos", value: 30, color: "#181818" },
      { label: "Renda fixa", value: 25, color: "#9c9c9c" },
    ],
  },
  {
    id: 3,
    name: "Fernanda Oliveira",
    initials: "FO",
    email: "fernanda.oliveira@exemplo.com",
    profile: "Conservador",
    assets: 1420000,
    change: 5.1,
    institutions: 2,
    consent: "Expirando",
    color: "#e2c6b9",
    opportunity: "Consentimento vence em 5 dias. Solicite a renovação.",
    allocation: [
      { label: "Renda fixa", value: 76, color: "#f6c945" },
      { label: "Previdência", value: 16, color: "#181818" },
      { label: "Fundos", value: 8, color: "#9c9c9c" },
    ],
  },
  {
    id: 4,
    name: "Carlos Mendes",
    initials: "CM",
    email: "carlos.mendes@exemplo.com",
    profile: "Moderado",
    assets: 980000,
    change: -1.8,
    institutions: 2,
    consent: "Ativo",
    color: "#c4c8db",
    opportunity: "Movimentação recente sugere necessidade de revisar liquidez.",
    allocation: [
      { label: "Renda fixa", value: 48, color: "#f6c945" },
      { label: "Fundos", value: 32, color: "#181818" },
      { label: "Ações", value: 20, color: "#9c9c9c" },
    ],
  },
  {
    id: 5,
    name: "Juliana Ferreira",
    initials: "JF",
    email: "juliana.ferreira@exemplo.com",
    profile: "Arrojado",
    assets: 760000,
    change: 14.6,
    institutions: 1,
    consent: "Pendente",
    color: "#d9c9ab",
    opportunity: "Autorização pendente para análise consolidada.",
    allocation: [
      { label: "Ações", value: 52, color: "#f6c945" },
      { label: "Fundos", value: 28, color: "#181818" },
      { label: "Renda fixa", value: 20, color: "#9c9c9c" },
    ],
  },
  {
    id: 6,
    name: "Pedro Santos",
    initials: "PS",
    email: "pedro.santos@exemplo.com",
    profile: "Moderado",
    assets: 610000,
    change: 3.7,
    institutions: 3,
    consent: "Ativo",
    color: "#b9d0d0",
    opportunity: "Reserva de emergência abaixo da meta informada.",
    allocation: [
      { label: "Renda fixa", value: 42, color: "#f6c945" },
      { label: "Fundos", value: 38, color: "#181818" },
      { label: "Ações", value: 20, color: "#9c9c9c" },
    ],
  },
];

// Séries fixas usadas apenas para compor o gráfico do painel.
const chart: Record<string, number[]> = {
  "30 dias": [32, 38, 34, 45, 41, 49, 47, 56, 52, 60, 57, 66, 63, 72, 69, 78],
  "90 dias": [25, 30, 28, 35, 40, 37, 46, 43, 51, 57, 54, 62, 64, 68, 72, 78],
  "12 meses": [18, 25, 23, 31, 29, 39, 36, 43, 48, 46, 58, 62, 60, 69, 72, 78],
};
const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
const compactMoney = (value: number) =>
  value >= 1000000
    ? `R$ ${(value / 1000000).toFixed(2).replace(".", ",")} mi`
    : `R$ ${(value / 1000).toFixed(0)} mil`;

function Avatar({ client, large = false }: { client: Client; large?: boolean }) {
  return (
    <span className={`client-avatar ${large ? "large" : ""}`} style={{ background: client.color }}>
      {client.initials}
    </span>
  );
}
function Status({ status }: { status: Consent }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}
function MiniChart({ period }: { period: string }) {
  const values = chart[period];
  // O SVG usa coordenadas de 0 a 100; valores maiores ficam mais altos no gráfico.
  const points = values
    .map((v, index) => `${(index / (values.length - 1)) * 100},${92 - v}`)
    .join(" ");
  return (
    <div
      className="chart-wrap"
      aria-label={`Evolução do patrimônio nos últimos ${period}`}
      role="img"
    >
      <div className="chart-guides">
        <span>R$ 50 mi</span>
        <span>R$ 45 mi</span>
        <span>R$ 40 mi</span>
        <span>R$ 35 mi</span>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="growth-chart">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8d44a" stopOpacity=".27" />
            <stop offset="100%" stopColor="#f8d44a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 100,100`} fill="url(#chartFill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#e9b920"
          strokeWidth="1.05"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="100" cy={92 - values[values.length - 1]} r="1.15" fill="#e9b920" />
      </svg>
      <div className="chart-months">
        <span>Início</span>
        <span>Período selecionado</span>
        <span>Hoje</span>
      </div>
    </div>
  );
}

export default function AdvisorApp({ section }: { section: Section }) {
  const router = useRouter();
  const [period, setPeriod] = useState("12 meses");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "finance" | "consent">("overview");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(
    () =>
      clients.filter((client) => {
        const matches = `${client.name} ${client.email} ${client.profile}`
          .toLowerCase()
          .includes(search.toLowerCase());
        return matches && (filter === "Todos" || client.consent === filter);
      }),
    [search, filter],
  );
  const openClient = (client: Client) => {
    setSelectedClient(client);
    setDrawerTab("overview");
  };
  const navigate = (next: Section) => {
    setMenuOpen(false);
    router.push(routes[next]);
  };
  const exportCsv = () => {
    const rows = [
      ["Cliente", "Perfil", "Patrimônio (BRL)", "Variação (%)", "Instituições", "Consentimento"],
      ...filtered.map((client) => [
        client.name,
        client.profile,
        String(client.assets),
        String(client.change),
        String(client.institutions),
        client.consent,
      ]),
    ];
    // BOM UTF-8, ponto e vírgula e aspas escapadas facilitam a abertura no Excel em pt-BR.
    const csv =
      "\uFEFF" +
      rows
        .map((row) => row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(";"))
        .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "xp-open-finance-clientes.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const sendInvite = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inviteName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setInviteError("Informe o nome e um e-mail válido.");
      return;
    }
    // Por enquanto, a confirmação altera apenas o estado local; nenhum e-mail é enviado.
    setInviteError("");
    setInviteSent(true);
  };
  const nav = [
    { id: "overview" as Section, label: "Visão geral", icon: LayoutDashboard },
    { id: "clients" as Section, label: "Clientes", icon: Users },
    { id: "connections" as Section, label: "Conexões", icon: Link2 },
    { id: "insights" as Section, label: "Oportunidades", icon: Sparkles, count: 12 },
  ];
  const titles = {
    overview: "Visão geral",
    clients: "Clientes",
    connections: "Conexões",
    insights: "Oportunidades",
  };
  return (
    <div className="app-shell">
      {menuOpen && (
        <button
          className="mobile-scrim"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand" aria-label="XP Open Finance">
            <span className="brand-mark">
              <Image src="/xp-logo.svg" alt="XP Investimentos" width={31} height={31} />
            </span>
            <span className="brand-copy">
              <strong>XP</strong>
              <small>OPEN FINANCE</small>
            </span>
          </div>
          <button
            className="sidebar-close"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="workspace-label">
          <span className="workspace-icon">
            <BarChart3 size={17} />
          </span>
          <span>
            Área do assessor<small>Hackathon XP</small>
          </span>
          <ChevronDown size={16} className="workspace-chevron" />
        </div>
        <div className="nav-caption">MENU PRINCIPAL</div>
        <nav aria-label="Navegação principal">
          {nav.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              className={`nav-item ${section === id ? "active" : ""}`}
              aria-current={section === id ? "page" : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={19} strokeWidth={1.9} />
              <span>{label}</span>
              {count && <em>{count}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-bottom">
          <span className="advisor-avatar">AC</span>
          <span>
            <strong>Ana Carvalho</strong>
            <small>Assessor de investimentos</small>
          </span>
          <button
            className="logout-button"
            type="button"
            aria-label="Sair da conta"
            title="Sair da conta"
            onClick={() => {
              signOut();
              router.replace("/");
              router.refresh();
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu icon-button"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={21} />
            </button>
            <Image
              className="mobile-logo"
              src="/xp-logo.svg"
              alt="XP Investimentos"
              width={24}
              height={24}
            />
            <span className="breadcrumb">Plataforma</span>
            <ChevronRight size={15} className="breadcrumb-arrow" />
            <strong>{titles[section]}</strong>
          </div>
          <div className="topbar-right">
            <button
              className="icon-button notification-button"
              aria-label="Notificações"
              onClick={() => setNotice("Nenhuma nova notificação.")}
            >
              <Bell size={19} />
              <i />
            </button>
            <span className="topbar-avatar">AC</span>
          </div>
        </header>
        {notice && (
          <div className="notice" role="status">
            <ShieldCheck size={17} />
            <span>{notice}</span>
            <button onClick={() => setNotice("")} aria-label="Fechar aviso">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="content">
          {section === "overview" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> INTELIGÊNCIA PARA ASSESSORIA
                  </div>
                  <h1>
                    Bom dia, Ana <span className="wave">✳</span>
                  </h1>
                  <p>Uma visão completa dos seus clientes para decisões mais estratégicas.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    setInviteOpen(true);
                    setInviteSent(false);
                  }}
                >
                  <Plus size={18} /> Convidar cliente
                </button>
              </div>
              <div className="metric-grid">
                <Metric
                  icon={Wallet}
                  label="Patrimônio acompanhado"
                  value="R$ 48,9 mi"
                  detail="Visão consolidada da carteira"
                  trend="+8,2%"
                />
                <Metric
                  icon={Users}
                  label="Clientes ativos"
                  value="128"
                  detail="Na sua carteira"
                  trend="+12 este mês"
                />
                <Metric
                  icon={Link2}
                  label="Consentimentos ativos"
                  value="86"
                  detail="67% da base de clientes"
                  progress={67}
                />
                <Metric
                  icon={Sparkles}
                  label="Oportunidades"
                  value="12"
                  detail="Insights para acompanhar"
                  action={() => navigate("insights")}
                />
              </div>
              <div className="overview-grid">
                <section className="panel growth-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="section-kicker">EVOLUÇÃO DA CARTEIRA</div>
                      <h2>Patrimônio acompanhado</h2>
                      <p>Evolução do patrimônio dos clientes</p>
                    </div>
                    <select
                      className="period-select"
                      aria-label="Selecionar período"
                      value={period}
                      onChange={(event) => setPeriod(event.target.value)}
                    >
                      <option>30 dias</option>
                      <option>90 dias</option>
                      <option>12 meses</option>
                    </select>
                  </div>
                  <div className="growth-value">
                    R$ 48.920.000{" "}
                    <span>
                      <ArrowUpRight size={14} /> 8,2%
                    </span>
                  </div>
                  <MiniChart period={period} />
                </section>
                <section className="panel attention-panel">
                  <div className="panel-heading">
                    <div>
                      <div className="section-kicker">ATENÇÃO DO DIA</div>
                      <h2>Prioridades</h2>
                      <p>O que merece sua atenção agora</p>
                    </div>
                    <span className="attention-count">3</span>
                  </div>
                  <div className="priority-list">
                    <button onClick={() => openClient(clients[2])}>
                      <span className="priority-icon amber">
                        <Clock3 size={18} />
                      </span>
                      <span>
                        <strong>Consentimento próximo do vencimento</strong>
                        <small>Fernanda Oliveira · vence em 5 dias</small>
                      </span>
                      <ChevronRight size={17} />
                    </button>
                    <button onClick={() => openClient(clients[0])}>
                      <span className="priority-icon gray">
                        <SlidersHorizontal size={18} />
                      </span>
                      <span>
                        <strong>Carteira concentrada</strong>
                        <small>Mariana Costa · 58% em renda fixa</small>
                      </span>
                      <ChevronRight size={17} />
                    </button>
                    <button onClick={() => openClient(clients[1])}>
                      <span className="priority-icon blue">
                        <TrendingUp size={18} />
                      </span>
                      <span>
                        <strong>Potencial de alocação</strong>
                        <small>Ricardo Almeida · recursos disponíveis</small>
                      </span>
                      <ChevronRight size={17} />
                    </button>
                  </div>
                  <button className="text-link" onClick={() => navigate("insights")}>
                    Ver todas as oportunidades <ArrowRight size={16} />
                  </button>
                </section>
              </div>
              <ClientsPanel
                filtered={clients.slice(0, 4)}
                onOpen={openClient}
                onAll={() => navigate("clients")}
                compact
              />
            </>
          )}
          {section === "clients" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> RELACIONAMENTO
                  </div>
                  <h1>Seus clientes</h1>
                  <p>Consulte perfis e patrimônio em uma única visão.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    setInviteOpen(true);
                    setInviteSent(false);
                  }}
                >
                  <Plus size={18} /> Convidar cliente
                </button>
              </div>
              <div className="list-tools">
                <div className="search-field">
                  <Search size={18} />
                  <input
                    aria-label="Buscar cliente"
                    placeholder="Buscar por nome, e-mail ou perfil"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
                <div className="filter-field">
                  <Filter size={17} />
                  <select
                    aria-label="Filtrar consentimento"
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                  >
                    <option>Todos</option>
                    <option>Ativo</option>
                    <option>Pendente</option>
                    <option>Expirando</option>
                  </select>
                </div>
                <button className="secondary-button" onClick={exportCsv}>
                  <Download size={17} /> Exportar CSV
                </button>
              </div>
              <ClientsPanel filtered={filtered} onOpen={openClient} />
            </>
          )}
          {section === "connections" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> OPEN FINANCE
                  </div>
                  <h1>Conexões</h1>
                  <p>Acompanhe autorizações e instituições compartilhadas pelos clientes.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => {
                    setInviteOpen(true);
                    setInviteSent(false);
                  }}
                >
                  <Plus size={18} /> Novo convite
                </button>
              </div>
              <div className="connection-summary">
                <div>
                  <span className="summary-icon">
                    <Link2 size={23} />
                  </span>
                  <strong>86</strong>
                  <small>Consentimentos ativos</small>
                </div>
                <div>
                  <span className="summary-icon">
                    <Clock3 size={23} />
                  </span>
                  <strong>07</strong>
                  <small>Próximos do vencimento</small>
                </div>
                <div>
                  <span className="summary-icon">
                    <ShieldCheck size={23} />
                  </span>
                  <strong>04</strong>
                  <small>Instituições representadas</small>
                </div>
              </div>
              <section className="panel connections-panel">
                <div className="panel-heading">
                  <div>
                    <div className="section-kicker">ACOMPANHAMENTO</div>
                    <h2>Consentimentos dos clientes</h2>
                  </div>
                </div>
                <div className="connection-list">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        openClient(client);
                        setDrawerTab("consent");
                      }}
                    >
                      <Avatar client={client} />
                      <span className="connection-person">
                        <strong>{client.name}</strong>
                        <small>
                          {client.institutions}{" "}
                          {client.institutions === 1 ? "instituição" : "instituições"}{" "}
                          compartilhadas
                        </small>
                      </span>
                      <Status status={client.consent} />
                      <ChevronRight size={17} />
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}
          {section === "insights" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> INTELIGÊNCIA DE CARTEIRA
                  </div>
                  <h1>Oportunidades</h1>
                  <p>Sinais para apoiar conversas relevantes com cada cliente.</p>
                </div>
                <span className="insight-counter">
                  <Sparkles size={17} /> 12 insights identificados
                </span>
              </div>
              <div className="insight-intro">
                <Sparkles size={24} />
                <div>
                  <strong>Transforme dados em conversas melhores</strong>
                  <p>
                    Valide o contexto, o perfil e a adequação antes de recomendar qualquer ação.
                  </p>
                </div>
              </div>
              <div className="insight-grid">
                {clients.map((client, index) => (
                  <button
                    className="insight-card"
                    key={client.id}
                    onClick={() => openClient(client)}
                  >
                    <div className="insight-top">
                      <span className={`insight-type type-${index % 3}`}>
                        {["Diversificação", "Alocação", "Relacionamento"][index % 3]}
                      </span>
                      <ArrowUpRight size={18} />
                    </div>
                    <strong>{client.opportunity}</strong>
                    <div className="insight-person">
                      <Avatar client={client} />
                      <span>
                        <b>{client.name}</b>
                        <small>
                          {client.profile} · {compactMoney(client.assets)}
                        </small>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      {selectedClient && (
        <div className="drawer-layer">
          <button
            className="drawer-backdrop"
            aria-label="Fechar detalhes"
            onClick={() => setSelectedClient(null)}
          />
          <aside className="client-drawer" aria-label={`Detalhes de ${selectedClient.name}`}>
            <div className="drawer-head">
              <span>PERFIL DO CLIENTE</span>
              <button
                className="icon-button"
                aria-label="Fechar detalhes"
                onClick={() => setSelectedClient(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="drawer-person">
              <Avatar client={selectedClient} large />
              <div>
                <h2>{selectedClient.name}</h2>
                <p>{selectedClient.email}</p>
              </div>
            </div>
            <div className="drawer-meta">
              <span>
                Perfil <strong>{selectedClient.profile}</strong>
              </span>
              <span>
                Consentimento <Status status={selectedClient.consent} />
              </span>
            </div>
            <div className="drawer-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={drawerTab === "overview"}
                className={drawerTab === "overview" ? "selected" : ""}
                onClick={() => setDrawerTab("overview")}
              >
                Visão geral
              </button>
              <button
                role="tab"
                aria-selected={drawerTab === "finance"}
                className={drawerTab === "finance" ? "selected" : ""}
                onClick={() => setDrawerTab("finance")}
              >
                Finanças
              </button>
              <button
                role="tab"
                aria-selected={drawerTab === "consent"}
                className={drawerTab === "consent" ? "selected" : ""}
                onClick={() => setDrawerTab("consent")}
              >
                Open Finance
              </button>
            </div>
            <div className="drawer-body">
              {drawerTab === "overview" && (
                <>
                  <div className="drawer-highlight">
                    <small>PATRIMÔNIO ACOMPANHADO</small>
                    <strong>{money(selectedClient.assets)}</strong>
                    <span className={selectedClient.change >= 0 ? "positive" : "negative"}>
                      {selectedClient.change >= 0 ? (
                        <ArrowUpRight size={15} />
                      ) : (
                        <ArrowDownRight size={15} />
                      )}
                      {Math.abs(selectedClient.change).toFixed(1).replace(".", ",")}% no período
                    </span>
                  </div>
                  <h3>Insight para acompanhamento</h3>
                  <div className="drawer-insight">
                    <Sparkles size={20} />
                    <p>{selectedClient.opportunity}</p>
                  </div>
                  <h3>Dados pessoais</h3>
                  <div className="data-row">
                    <span>Nome</span>
                    <strong>{selectedClient.name}</strong>
                  </div>
                  <div className="data-row">
                    <span>E-mail</span>
                    <strong>{selectedClient.email}</strong>
                  </div>
                  <div className="data-row">
                    <span>Perfil de investidor</span>
                    <strong>{selectedClient.profile}</strong>
                  </div>
                </>
              )}
              {drawerTab === "finance" && (
                <>
                  <h3>Alocação da carteira</h3>
                  <p className="drawer-muted">Distribuição dos recursos compartilhados.</p>
                  <div className="allocation-bar">
                    {selectedClient.allocation.map((item) => (
                      <span
                        key={item.label}
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    ))}
                  </div>
                  <div className="allocation-legend">
                    {selectedClient.allocation.map((item) => (
                      <div key={item.label}>
                        <span style={{ background: item.color }} />
                        {item.label}
                        <strong>{item.value}%</strong>
                      </div>
                    ))}
                  </div>
                  <div className="drawer-highlight light">
                    <small>TOTAL CONSOLIDADO</small>
                    <strong>{money(selectedClient.assets)}</strong>
                  </div>
                </>
              )}
              {drawerTab === "consent" && (
                <>
                  <div className="consent-card">
                    <ShieldCheck size={24} />
                    <div>
                      <strong>Consentimento {selectedClient.consent.toLowerCase()}</strong>
                      <p>
                        {selectedClient.consent === "Ativo"
                          ? "Dados disponíveis para consulta."
                          : selectedClient.consent === "Expirando"
                            ? "A autorização precisa ser renovada em breve."
                            : "Aguardando autorização do cliente."}
                      </p>
                    </div>
                  </div>
                  <h3>Instituições compartilhadas</h3>
                  <div className="data-row">
                    <span>Quantidade</span>
                    <strong>{selectedClient.institutions}</strong>
                  </div>
                  <button
                    className="drawer-action"
                    onClick={() =>
                      setNotice(
                        "A solicitação ficará disponível após a integração com Open Finance.",
                      )
                    }
                  >
                    Solicitar atualização <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
      {inviteOpen && (
        <div className="modal-layer">
          <button
            className="modal-backdrop"
            aria-label="Fechar convite"
            onClick={() => setInviteOpen(false)}
          />
          <div
            className="invite-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
          >
            <button
              className="modal-close icon-button"
              aria-label="Fechar convite"
              onClick={() => setInviteOpen(false)}
            >
              <X size={20} />
            </button>
            {inviteSent ? (
              <div className="invite-success">
                <span>
                  <Check size={30} />
                </span>
                <h2 id="invite-title">Convite preparado</h2>
                <p>
                  Convite de {inviteName} preparado. O envio ficará disponível após a integração.
                </p>
                <button className="primary-button" onClick={() => setInviteOpen(false)}>
                  Concluir
                </button>
              </div>
            ) : (
              <>
                <div className="modal-icon">
                  <Mail size={23} />
                </div>
                <h2 id="invite-title">Convidar cliente</h2>
                <p>Prepare um convite para que o cliente compartilhe seus dados financeiros.</p>
                <form onSubmit={sendInvite}>
                  <label htmlFor="invite-name">Nome do cliente</label>
                  <input
                    id="invite-name"
                    placeholder="Ex.: Maria Silva"
                    value={inviteName}
                    onChange={(event) => setInviteName(event.target.value)}
                  />
                  <label htmlFor="invite-email">E-mail</label>
                  <input
                    id="invite-email"
                    type="email"
                    placeholder="cliente@exemplo.com"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                  />
                  {inviteError && <span className="form-error">{inviteError}</span>}
                  <div className="modal-note">
                    <ShieldCheck size={17} /> O envio será habilitado com a integração.
                  </div>
                  <button type="submit" className="primary-button">
                    Preparar convite <ArrowRight size={17} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  trend,
  progress,
  action,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  detail: string;
  trend?: string;
  progress?: number;
  action?: () => void;
}) {
  const content = (
    <>
      <div className="metric-top">
        <span className="metric-icon">
          <Icon size={20} strokeWidth={1.8} />
        </span>
        <ArrowUpRight size={17} className="metric-arrow" />
      </div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom">
        <span>{detail}</span>
        {trend && <b>{trend}</b>}
      </div>
      {progress && (
        <div className="metric-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </>
  );
  return action ? (
    <button className="metric-card metric-clickable" onClick={action}>
      {content}
    </button>
  ) : (
    <div className="metric-card">{content}</div>
  );
}
function ClientsPanel({
  filtered,
  onOpen,
  onAll,
  compact = false,
}: {
  filtered: Client[];
  onOpen: (client: Client) => void;
  onAll?: () => void;
  compact?: boolean;
}) {
  return (
    <section className="panel clients-panel">
      <div className="panel-heading">
        <div>
          <div className="section-kicker">SUA CARTEIRA</div>
          <h2>{compact ? "Clientes em destaque" : "Lista de clientes"}</h2>
          <p>
            {compact
              ? "Acompanhe os perfis mais recentes"
              : `${filtered.length} clientes encontrados`}
          </p>
        </div>
        {onAll && (
          <button className="text-link" onClick={onAll}>
            Ver todos <ArrowRight size={16} />
          </button>
        )}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>CLIENTE</th>
              <th>PERFIL</th>
              <th>PATRIMÔNIO</th>
              <th>VARIAÇÃO</th>
              <th>OPEN FINANCE</th>
              <th aria-label="Abrir" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr
                key={client.id}
                onClick={() => onOpen(client)}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onOpen(client);
                }}
              >
                <td>
                  <span className="table-person">
                    <Avatar client={client} />
                    <span>
                      <strong>{client.name}</strong>
                      <small>{client.email}</small>
                    </span>
                  </span>
                </td>
                <td>
                  <span className="profile-pill">{client.profile}</span>
                </td>
                <td className="amount-cell">{money(client.assets)}</td>
                <td>
                  <span className={`change-cell ${client.change >= 0 ? "positive" : "negative"}`}>
                    {client.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(client.change).toFixed(1).replace(".", ",")}%
                  </span>
                </td>
                <td>
                  <Status status={client.consent} />
                </td>
                <td>
                  <ChevronRight size={18} className="row-chevron" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Search size={23} />
            <strong>Nenhum cliente encontrado</strong>
            <span>Tente outro nome ou ajuste o filtro.</span>
          </div>
        )}
      </div>
      {!compact && (
        <div className="table-footer">
          <span>
            Exibindo {filtered.length} de {clients.length} clientes
          </span>
        </div>
      )}
    </section>
  );
}
