import { clients, getClientById } from "./mock-data";

// Latência curta para reproduzir a experiência de consulta enquanto não há backend.
const waitForMockResponse = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export async function requestMockClients() {
  await waitForMockResponse(650);
  return clients;
}

export async function requestMockClientById(id: string | number) {
  await waitForMockResponse(750);
  return getClientById(id);
}
