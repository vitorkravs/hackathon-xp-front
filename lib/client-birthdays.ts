import { clientProfiles, type Client } from "./mock-data";

export type ClientBirthday = {
  client: Client;
  day: number;
  month: number;
  daysUntil: number;
  isToday: boolean;
};

export function formatBirthDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

// Considera somente aniversários de hoje em diante no mês corrente.
export function getClientBirthday(client: Client, todayIso: string): ClientBirthday | null {
  const birthDate = clientProfiles[client.id]?.birthDate;
  const birth = birthDate?.match(/^\d{4}-(\d{2})-(\d{2})$/);
  const today = todayIso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!birth || !today) return null;

  const month = Number(birth[1]);
  const day = Number(birth[2]);
  const todayMonth = Number(today[2]);
  const todayDay = Number(today[3]);
  if (month !== todayMonth || day < todayDay) return null;

  const daysUntil = Math.round(
    (Date.UTC(Number(today[1]), month - 1, day) -
      Date.UTC(Number(today[1]), todayMonth - 1, todayDay)) /
      86_400_000,
  );
  return { client, day, month, daysUntil, isToday: daysUntil === 0 };
}

export function getUpcomingClientBirthdays(clients: Client[], todayIso: string): ClientBirthday[] {
  return clients
    .map((client) => getClientBirthday(client, todayIso))
    .filter((birthday): birthday is ClientBirthday => birthday !== null)
    .sort((a, b) => a.daysUntil - b.daysUntil || a.client.name.localeCompare(b.client.name));
}

export function birthdayLabel(birthday: ClientBirthday): string {
  if (birthday.isToday) return "Aniversário hoje";
  return `Aniversário em ${birthday.daysUntil} ${birthday.daysUntil === 1 ? "dia" : "dias"}`;
}
