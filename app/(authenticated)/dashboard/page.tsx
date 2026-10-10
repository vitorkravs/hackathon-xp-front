"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Link2,
  Plus,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { clients, type Client } from "@/lib/mock-data";
import { Metric } from "../components/Metric";
import { PortfolioChart } from "../components/PortfolioChart";
import { ClientsTable } from "../components/ClientsTable";
import { InviteModal } from "../components/InviteModal";

export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("12 meses");
  const [inviteOpen, setInviteOpen] = useState(false);
  const navigate = (section: "clients" | "insights") =>
    router.push(section === "clients" ? "/clientes" : "/oportunidades");
  const openClient = (client: Client) => router.push(`/clientes/${client.id}`);
  return (
    <>
      <div className="content">
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-line" /> INTELIGÊNCIA PARA ASSESSORIA
            </div>
            <h1>Bom dia, Ana</h1>
            <p>Uma visão completa dos seus clientes para decisões mais estratégicas.</p>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              setInviteOpen(true);
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
            icon={Target}
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
            <PortfolioChart period={period} />
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
        <ClientsTable
          filtered={clients.slice(0, 4)}
          onOpen={openClient}
          onAll={() => navigate("clients")}
          compact
        />
      </div>
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}
