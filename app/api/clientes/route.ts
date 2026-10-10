import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requestMockClients } from "@/lib/mock-client-requests";

export async function GET() {
  const session = (await cookies()).get("xp-demo-session")?.value;
  if (session !== "active") {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  const clients = await requestMockClients();
  return NextResponse.json(
    { clients },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
