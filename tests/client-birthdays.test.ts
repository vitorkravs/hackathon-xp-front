import assert from "node:assert/strict";
import test from "node:test";
import {
  birthdayLabel,
  getClientBirthday,
  getUpcomingClientBirthdays,
} from "../lib/client-birthdays";
import { todayInSaoPaulo } from "../lib/local-date";
import { clients } from "../lib/mock-data";

test("aniversários de hoje e do restante do mês aparecem em ordem", () => {
  const birthdays = getUpcomingClientBirthdays(clients, "2026-10-10");
  assert.deepEqual(
    birthdays.map((item) => [item.client.id, item.daysUntil]),
    [
      [5, 0],
      [1, 4],
    ],
  );
  assert.equal(birthdayLabel(birthdays[0]), "Aniversário hoje");
  assert.equal(birthdayLabel(birthdays[1]), "Aniversário em 4 dias");
});

test("aniversários passados e de outros meses não geram aviso", () => {
  assert.equal(getClientBirthday(clients[4], "2026-10-11"), null);
  assert.equal(getClientBirthday(clients[0], "2026-11-01"), null);
  assert.deepEqual(getUpcomingClientBirthdays(clients, "2026-11-01"), []);
});

test("a data civil usa o fuso de São Paulo", () => {
  assert.equal(todayInSaoPaulo(new Date("2026-10-11T02:30:00Z")), "2026-10-10");
  assert.equal(todayInSaoPaulo(new Date("2026-10-11T03:30:00Z")), "2026-10-11");
});
