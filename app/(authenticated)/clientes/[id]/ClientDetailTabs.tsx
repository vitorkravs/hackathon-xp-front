"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarClock, ChartNoAxesCombined, CircleAlert, ShieldCheck } from "lucide-react";
import { parseClientAnalyses, type ClientAnalysesResponse } from "@/lib/analysis-contract";
import { CreditScorePanel } from "./CreditScorePanel";
import { FgcExposurePanel } from "./FgcExposurePanel";

type Tab = "overview" | "fgc" | "credit" | "alerts";
const tabs: { id: Tab; label: string; icon: typeof ShieldCheck }[] = [
  { id: "overview", label: "Visão geral", icon: ChartNoAxesCombined },
  { id: "fgc", label: "Proteção FGC", icon: ShieldCheck },
  { id: "credit", label: "Risco de crédito", icon: CircleAlert },
  { id: "alerts", label: "Vencimentos e alertas", icon: CalendarClock },
];

export function ClientDetailTabs({
  clientId,
  overview,
}: {
  clientId: number;
  overview: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [data, setData] = useState<ClientAnalysesResponse | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/clientes/${clientId}/analises`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Falha ao carregar análises.");
        const result = parseClientAnalyses(await response.json());
        if (!result) throw new Error("Formato de análise inválido.");
        setData(result);
        setState("ready");
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }
    load();
    return () => controller.abort();
  }, [clientId]);

  let content: ReactNode;
  if (activeTab === "overview") {
    content = overview;
  } else if (state === "loading") {
    content = (
      <section className="panel analysis-panel analysis-placeholder">Carregando análises…</section>
    );
  } else if (state === "error") {
    content = (
      <section className="panel analysis-panel" role="alert">
        Não foi possível carregar as análises. Tente novamente mais tarde.
      </section>
    );
  } else if (activeTab === "fgc") {
    content = <FgcExposurePanel analysis={data?.fgcAnalysis} isMock={data?.isMock} />;
  } else if (activeTab === "credit") {
    content = <CreditScorePanel assessment={data?.creditAssessment} isMock={data?.isMock} />;
  } else {
    content = <MaturitiesAlertsPanel data={data} />;
  }

  return (
    <div className="client-detail-tabs">
      <div className="client-tabs" role="tablist" aria-label="Detalhes do cliente">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`client-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls="client-tab-panel"
            className={activeTab === id ? "client-tab active" : "client-tab"}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={17} /> {label}
          </button>
        ))}
      </div>
      <div id="client-tab-panel" role="tabpanel" aria-labelledby={`client-tab-${activeTab}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            className="client-tab-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}

function MaturitiesAlertsPanel({ data }: { data: ClientAnalysesResponse | null }) {
  const maturities = data?.maturities;
  const alerts = data?.alerts;
  const money = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="detail-columns">
      <section className="panel detail-section" aria-labelledby="maturities-title">
        <div className="detail-section-heading">
          <div>
            <span className="section-kicker">AGENDA</span>
            <h2 id="maturities-title">Vencimentos</h2>
          </div>
          {data?.isMock && <span className="analysis-sample">Dados fictícios</span>}
        </div>
        {maturities === undefined ? (
          <p className="analysis-muted">Datas de vencimento indisponíveis.</p>
        ) : maturities.length === 0 ? (
          <p className="analysis-muted">Nenhum vencimento futuro identificado.</p>
        ) : (
          <div className="maturity-list">
            {maturities.map((maturity) => (
              <div className="maturity-item" key={maturity.positionId}>
                <div>
                  <strong>{maturity.productName}</strong>
                  <small>
                    {formatDate(maturity.maturityDate)} · em {maturity.daysUntil} dias
                  </small>
                </div>
                <strong>{money(maturity.amount)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="panel detail-section" aria-labelledby="alerts-title">
        <div className="detail-section-heading">
          <div>
            <span className="section-kicker">ACOMPANHAMENTO</span>
            <h2 id="alerts-title">Alertas explicáveis</h2>
          </div>
          <span>{alerts?.length ?? 0} alertas</span>
        </div>
        {alerts === undefined ? (
          <p className="analysis-muted">Alertas indisponíveis.</p>
        ) : alerts.length === 0 ? (
          <p className="analysis-muted">Nenhum alerta gerado com os dados simulados disponíveis.</p>
        ) : (
          <div className="risk-alert-list">
            {alerts.map((alert) => (
              <article className="risk-alert" key={alert.id}>
                <div className="risk-alert-title">
                  <strong>{alert.title}</strong>
                  <span data-severity={alert.severity}>{alert.severity}</span>
                </div>
                <p>{alert.description}</p>
                <small>
                  Relacionado a {alert.relatedTo} · {alert.status} · {formatDate(alert.asOf)}
                </small>
                <small>Fonte: {alert.source}</small>
                <p>
                  <strong>Próximo passo:</strong> {alert.action}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
