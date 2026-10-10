"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Cake,
  CalendarClock,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { money, type Client, type ClientProfile } from "@/lib/mock-data";
import type { InvestmentMaturity } from "@/lib/analysis-contract";
import { birthdayLabel, formatBirthDate, getClientBirthday } from "@/lib/client-birthdays";
import type { MockPosition } from "@/lib/mock-positions";
import { Avatar, Status } from "../../components/ClientVisuals";
import { ClientDetailTabs } from "./ClientDetailTabs";
import { ClientDetailSkeleton } from "./ClientDetailSkeleton";

type ClientDetailResponse = {
  client: Client;
  profile: ClientProfile;
  positions: MockPosition[];
  asOf: string;
  calculatedOn: string;
  largestIssuer: { issuerName: string; amount: number } | null;
  nextMaturity: InvestmentMaturity | null;
};

function isClientDetailResponse(value: unknown): value is ClientDetailResponse {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<ClientDetailResponse>;
  return (
    typeof payload.client?.id === "number" &&
    typeof payload.client?.name === "string" &&
    typeof payload.profile?.birthDate === "string" &&
    typeof payload.asOf === "string" &&
    typeof payload.calculatedOn === "string" &&
    (payload.largestIssuer === null || typeof payload.largestIssuer?.amount === "number") &&
    (payload.nextMaturity === null || typeof payload.nextMaturity?.daysUntil === "number") &&
    Array.isArray(payload.positions)
  );
}

const allocationLabels: Record<string, string> = {
  "Renda fixa": "Renda fixa",
  Fundos: "Fundos de investimento",
};

export default function ClienteDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<ClientDetailResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "not-found">("loading");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadClient() {
      try {
        const response = await fetch(`/api/clientes/${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        if (!active) return;
        if (response.status === 401) {
          router.replace("/");
          return;
        }
        if (response.status === 404) {
          setStatus("not-found");
          return;
        }
        if (!response.ok) throw new Error("Falha na consulta do cliente.");
        const payload: unknown = await response.json();
        if (!active) return;
        if (!isClientDetailResponse(payload)) throw new Error("Resposta do cliente inválida.");
        setDetail(payload);
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    }
    const timer = window.setTimeout(loadClient, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [id, requestVersion, router]);

  if (status === "loading") return <ClientDetailSkeleton />;
  if (status === "not-found") {
    return (
      <div className="content client-load-error">
        <h1>Cliente não encontrado</h1>
        <Link href="/clientes" prefetch={false}>
          Voltar para clientes
        </Link>
      </div>
    );
  }
  if (status === "error" || !detail) {
    return (
      <div className="content">
        <section className="panel client-load-error" role="alert">
          <strong>Não foi possível carregar o cliente.</strong>
          <p>Tente consultar este perfil novamente.</p>
          <button
            className="secondary-button"
            onClick={() => {
              setStatus("loading");
              setRequestVersion((version) => version + 1);
            }}
          >
            Tentar novamente
          </button>
        </section>
      </div>
    );
  }

  const { client, profile, positions, asOf, calculatedOn, largestIssuer, nextMaturity } = detail;
  const birthday = getClientBirthday(client, calculatedOn);
  const fixedIncomeShare =
    client.allocation.find((item) => item.label === "Renda fixa")?.value ?? 0;
  const fixedIncomeAmount = Math.round((client.assets * fixedIncomeShare) / 100);
  const personalData = [
    ["Nome completo", client.name],
    ["Documento", profile.document],
    ["Tipo de documento", "CPF"],
    ["Data de nascimento", formatBirthDate(profile.birthDate)],
    ["Cargo", profile.occupation],
    ["E-mail pessoal", client.email],
    ["Telefone residencial", profile.phone],
    ["Endereço", profile.address],
  ];

  return (
    <div className="content client-detail-content">
      <Link href="/clientes" prefetch={false} className="detail-back">
        <ArrowLeft size={17} /> Voltar para clientes
      </Link>
      <div className="page-heading detail-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> VISÃO 360° DO CLIENTE
          </div>
          <h1>{client.name}</h1>
          <span className="analysis-sample">Dados fictícios</span>
          <p>Informações pessoais, carteira e pontos de atenção em um só lugar.</p>
        </div>
      </div>

      {birthday && (
        <section className="birthday-profile-notice" aria-label="Aviso de aniversário">
          <Cake size={23} aria-hidden="true" />
          <div>
            <strong>
              {birthdayLabel(birthday)}: {client.name}
            </strong>
            <span>
              {String(birthday.day).padStart(2, "0")}/{String(birthday.month).padStart(2, "0")} ·
              Dado cadastral fictício
            </span>
          </div>
        </section>
      )}

      <p className="detail-data-notice">
        Todos os clientes, saldos, posições, conexões e análises desta tela são fictícios. Nenhum
        dado foi recebido da Pluggy ou de uma conexão real Open Finance. Data-base da carteira:{" "}
        {asOf.split("-").reverse().join("/")}.
      </p>

      <section className="panel detail-profile-card" aria-label="Resumo do cliente">
        <div className="detail-profile-main">
          <Avatar client={client} large />
          <div>
            <h2>{client.name}</h2>
            <p>
              CPF: {profile.document} · Cliente desde {profile.since}
            </p>
            <div className="detail-connection">
              <span>Consentimento simulado:</span>
              <Status status={client.consent} />
              <span>Data-base simulada: {asOf.split("-").reverse().join("/")}</span>
            </div>
          </div>
        </div>
        <div className="detail-profile-aside">
          <span>Perfil de investidor</span>
          <strong>{client.profile}</strong>
        </div>
      </section>

      <div className="detail-metrics">
        <div className="panel detail-metric">
          <span>
            <Wallet size={19} /> Patrimônio investido
          </span>
          <strong>{money(client.assets)}</strong>
          <small>Saldo fictício acompanhado</small>
        </div>
        <div className="panel detail-metric">
          <span>
            <Landmark size={19} /> Instituições simuladas
          </span>
          <strong>{client.institutions}</strong>
          <small>Conexões financeiras fictícias</small>
        </div>
        <div className="panel detail-metric">
          <span>
            <ShieldCheck size={19} /> Renda fixa na carteira
          </span>
          <strong>{money(fixedIncomeAmount)}</strong>
          <small>{fixedIncomeShare}% do patrimônio acompanhado</small>
        </div>
        <div className="panel detail-metric">
          <span>
            <TrendingUp size={19} /> Maior exposição a emissor
          </span>
          <strong>{largestIssuer ? money(largestIssuer.amount) : "Não disponível"}</strong>
          <small>
            {largestIssuer
              ? `${((largestIssuer.amount / client.assets) * 100).toFixed(1).replace(".", ",")}% · ${largestIssuer.issuerName}`
              : "Emissor não identificado"}
          </small>
        </div>
        <div className="panel detail-metric">
          <span>
            <CalendarClock size={19} /> Próximo vencimento
          </span>
          <strong>{nextMaturity ? `${nextMaturity.daysUntil} dias` : "Não disponível"}</strong>
          <small>
            {nextMaturity?.productName ?? "Sem data informada"} · calculado em{" "}
            {calculatedOn.split("-").reverse().join("/")}
          </small>
        </div>
      </div>

      <ClientDetailTabs
        clientId={client.id}
        clientName={client.name}
        overview={
          <>
            <div className="detail-columns">
              <section className="panel detail-section">
                <div className="detail-section-heading">
                  <div>
                    <span className="section-kicker">CARTEIRA</span>
                    <h2>Composição da carteira</h2>
                  </div>
                  <span>{money(client.assets)}</span>
                </div>
                <div className="detail-allocation-list">
                  {client.allocation.map((item) => (
                    <div className="detail-allocation" key={item.label}>
                      <div>
                        <strong>{allocationLabels[item.label] ?? item.label}</strong>
                        <strong>{item.value}%</strong>
                      </div>
                      <div className="detail-progress">
                        <span style={{ width: `${item.value}%` }} />
                      </div>
                      <small>{money(Math.round((client.assets * item.value) / 100))}</small>
                    </div>
                  ))}
                </div>
              </section>
              <section className="panel detail-section">
                <div className="detail-section-heading">
                  <div>
                    <span className="section-kicker">INDICADORES</span>
                    <h2>Dashboard dos investimentos</h2>
                  </div>
                </div>
                <div className="detail-investment-stat">
                  <span>Variação no período</span>
                  <strong className={client.change >= 0 ? "positive" : "negative"}>
                    {client.change >= 0 ? "+" : ""}
                    {client.change.toFixed(1).replace(".", ",")}%
                  </strong>
                </div>
                <div className="detail-investment-stat">
                  <span>Patrimônio acompanhado</span>
                  <strong>{money(client.assets)}</strong>
                </div>
                <div className="detail-investment-stat">
                  <span>Instituições simuladas</span>
                  <strong>{client.institutions}</strong>
                </div>
                <div className="detail-investment-stat">
                  <span>Consentimento simulado</span>
                  <Status status={client.consent} />
                </div>
                <div className="detail-investment-foot">
                  <ShieldCheck size={18} /> Revise perfil e adequação antes de recomendar qualquer
                  ação.
                </div>
              </section>
            </div>

            <section className="panel detail-section">
              <div className="detail-section-heading">
                <div>
                  <span className="section-kicker">POSIÇÕES</span>
                  <h2>Investimentos</h2>
                </div>
                <span>{positions.length} posições</span>
              </div>
              <div className="detail-holdings">
                {positions.map((position) => (
                  <div className="detail-holding" key={position.id}>
                    <div>
                      <strong>{position.name}</strong>
                      <small>
                        {position.productType}
                        {position.issuerName ? ` · Emissor: ${position.issuerName}` : ""}
                        {position.maturityDate ? ` · Vence em ${position.maturityDate}` : ""}
                      </small>
                    </div>
                    <div>
                      <strong>{money(position.amount)}</strong>
                      <small>
                        {((position.amount / client.assets) * 100).toFixed(1).replace(".", ",")}% da
                        carteira
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel detail-section detail-personal">
              <div className="detail-section-heading">
                <div>
                  <span className="section-kicker">CADASTRO</span>
                  <h2>Informações pessoais</h2>
                </div>
              </div>
              <dl>
                {personalData.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </>
        }
      />
    </div>
  );
}
