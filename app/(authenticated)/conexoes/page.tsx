"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Clock3, Link2, Plus, ShieldCheck } from "lucide-react";
import { clients, type Client } from "@/lib/mock-data";
import { Avatar, Status } from "../components/ClientVisuals";
import { InviteModal } from "../components/InviteModal";

export default function ConexoesPage() {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = useState(false);
  const openClient = (client: Client) => router.push(`/clientes/${client.id}`);
  return (
    <>
      <div className="content">
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
                }}
              >
                <Avatar client={client} />
                <span className="connection-person">
                  <strong>{client.name}</strong>
                  <small>
                    {client.institutions}{" "}
                    {client.institutions === 1 ? "instituição" : "instituições"} compartilhadas
                  </small>
                </span>
                <Status status={client.consent} />
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>
      </div>
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}
