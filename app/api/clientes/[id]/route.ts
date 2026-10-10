import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clientProfiles } from "@/lib/mock-data";
import { requestMockClientById } from "@/lib/mock-client-requests";
import { getLargestIssuerExposure, getMockMaturities } from "@/lib/mock-analyses";
import { todayInSaoPaulo } from "@/lib/local-date";
import { getMockPositions, SIMULATION_AS_OF } from "@/lib/mock-positions";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = (await cookies()).get("xp-demo-session")?.value;
  if (session !== "active") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const client = await requestMockClientById(id);
  if (!client) {
    return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });
  }

  const positions = getMockPositions(client.id);
  const calculatedOn = todayInSaoPaulo();
  return NextResponse.json(
    {
      client,
      profile: clientProfiles[client.id],
      positions,
      asOf: SIMULATION_AS_OF,
      calculatedOn,
      largestIssuer: getLargestIssuerExposure(positions),
      nextMaturity: getMockMaturities(positions, calculatedOn)[0] ?? null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
