import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  CircleAlert,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { clientProfiles, clients, getClientById, money } from "@/lib/mock-data";
import { Avatar, Status } from "../../components/ClientVisuals";

export function generateStaticParams() {
  return clients.map((client) => ({ id: String(client.id) }));
}

const products: Record<string, { name: string; detail: string }> = {
  "Renda fixa": { name: "CDB Banco Exemplo", detail: "Emissor: Banco Exemplo · CDI" },
  Fundos: { name: "Fundo de investimento", detail: "Multimercado · Liquidez D+1" },
  Ações: { name: "Carteira de ações", detail: "Renda variável · B3" },
  Previdência: { name: "Plano de previdência", detail: "Previdência privada" },
};
const allocationLabels: Record<string, string> = {
  "Renda fixa": "Renda fixa bancária",
  Fundos: "Fundos de investimento",
};

export default async function ClienteDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = getClientById(id);
  if (!client) notFound();

  const profile = clientProfiles[client.id];
  const fgcCovered = Math.round(client.assets * profile.fgcShare);
  const maxIssuer = Math.round(client.assets * profile.issuerShare);
  const personalData = [
    ["Nome completo", client.name],
    ["Documento", profile.document],
    ["Tipo de documento", "CPF"],
    ["Data de nascimento", profile.birthDate],
    ["Cargo", profile.occupation],
    ["E-mail pessoal", client.email],
    ["Telefone residencial", profile.phone],
    ["Endereço", profile.address],
  ];

  return (
    <div className="content client-detail-content">
      <Link href="/clientes" className="detail-back">
        <ArrowLeft size={17} /> Voltar para clientes
      </Link>
      <div className="page-heading detail-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" /> VISÃO 360° DO CLIENTE
          </div>
          <h1>{client.name}</h1>
          <p>Informações pessoais, carteira e pontos de atenção em um só lugar.</p>
        </div>
      </div>

      <section className="panel detail-profile-card" aria-label="Resumo do cliente">
        <div className="detail-profile-main">
          <Avatar client={client} large />
          <div>
            <h2>{client.name}</h2>
            <p>
              CPF: {profile.document} · Cliente desde {profile.since}
            </p>
            <div className="detail-connection">
              <Status status={client.consent} />
              <span>Última atualização: {profile.lastUpdate}</span>
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
          <small>Saldo acompanhado</small>
        </div>
        <div className="panel detail-metric">
          <span>
            <Landmark size={19} /> Instituições
          </span>
          <strong>{client.institutions}</strong>
          <small>Conexões financeiras</small>
        </div>
        <div className="panel detail-metric">
          <span>
            <ShieldCheck size={19} /> Exposição coberta pelo FGC
          </span>
          <strong>{money(fgcCovered)}</strong>
          <small>Estimativa a validar</small>
        </div>
        <div className="panel detail-metric">
          <span>
            <TrendingUp size={19} /> Maior exposição a emissor
          </span>
          <strong>{money(maxIssuer)}</strong>
          <small>{(profile.issuerShare * 100).toFixed(1).replace(".", ",")}% da carteira</small>
        </div>
      </div>

      <section className="panel detail-attention">
        <h2>
          <CircleAlert size={20} /> Atenção do assessor
        </h2>
        {profile.issuerShare >= 0.25 && (
          <div className="attention-item">
            <CircleAlert size={18} />
            <div>
              <strong>Concentração elevada</strong>
              <p>
                {(profile.issuerShare * 100).toFixed(1).replace(".", ",")}% do patrimônio investido
                está associado a um mesmo emissor.
              </p>
            </div>
          </div>
        )}
        {profile.maturityDays <= 30 && (
          <div className="attention-item">
            <CalendarClock size={18} />
            <div>
              <strong>Vencimento próximo</strong>
              <p>Um investimento vence nos próximos {profile.maturityDays} dias.</p>
            </div>
          </div>
        )}
        <div className="attention-item">
          <ArrowUpRight size={18} />
          <div>
            <strong>Oportunidade de acompanhamento</strong>
            <p>{client.opportunity}</p>
          </div>
        </div>
      </section>

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
            <span>Instituições conectadas</span>
            <strong>{client.institutions}</strong>
          </div>
          <div className="detail-investment-stat">
            <span>Consentimento</span>
            <Status status={client.consent} />
          </div>
          <div className="detail-investment-foot">
            <ShieldCheck size={18} /> Revise perfil e adequação antes de recomendar qualquer ação.
          </div>
        </section>
      </div>

      <section className="panel detail-section">
        <div className="detail-section-heading">
          <div>
            <span className="section-kicker">POSIÇÕES</span>
            <h2>Investimentos</h2>
          </div>
          <span>{client.allocation.length} posições</span>
        </div>
        <div className="detail-holdings">
          {client.allocation.map((item) => {
            const product = products[item.label] ?? { name: item.label, detail: "Investimento" };
            return (
              <div className="detail-holding" key={item.label}>
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.detail}</small>
                </div>
                <div>
                  <strong>{money(Math.round((client.assets * item.value) / 100))}</strong>
                  <small>{item.value}% da carteira</small>
                </div>
              </div>
            );
          })}
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
    </div>
  );
}
