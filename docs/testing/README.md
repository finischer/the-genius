# Testkonzept TheGenius

Dieses Dokument legt fest, welche Art von Test für welche Änderung geschrieben wird, wie die Tests organisiert sind und wie man sie ausführt. Code-Bezeichner, Dateinamen und Befehle bleiben englisch.

Kennzeichnung: Alles, was zum Zeitpunkt dieser Dokumentation im Repo noch nicht existiert, ist mit **(geplant)** markiert.

## Inhalt

1. [Tests nur auf explizite Anfrage](#tests-nur-auf-explizite-anfrage)
2. [Testpyramide](#testpyramide)
3. [Entscheidungstabelle](#entscheidungstabelle)
4. [Verzeichnisse von `e2e/`](#verzeichnisse-von-e2e)
5. [Namenskonventionen](#namenskonventionen)
6. [Befehle](#befehle)
7. [Einrichtung](#einrichtung)
8. [Debuggen und Codegen](#debuggen-und-codegen)
9. [Authentifizierung in E2E-Läufen](#authentifizierung-in-e2e-läufen)
10. [Checklisten](#checklisten)
11. [Multiplayer-Tests](#multiplayer-tests)
12. [Flaky-Tests](#flaky-tests)
13. [CI, Secrets und GitHub-Environment](#ci-secrets-und-github-environment)
14. [Referenztests](#referenztests)
15. [Beispiele für Unit- und Integrationstests](#beispiele-für-unit--und-integrationstests)

## Tests nur auf explizite Anfrage

Tests werden nur geschrieben, wenn der Auftraggeber das ausdrücklich verlangt. Sie sind kein automatischer Bestandteil von Feature-Implementierungen oder Refactorings. Dieses Dokument beschreibt, **wie** getestet wird, sobald ein Test gewünscht ist.

## Testpyramide

| Ebene | Werkzeug | Testgegenstand | Ablageort |
|---|---|---|---|
| Unit | Vitest (+ `fast-check` für Eigenschaften) | Utilities in `src/utils/`, Spiel-Logik (State-Transformationen, Scoring), reine Funktionen in `e2e/support/` | `<code-ordner>/tests/unit/*.test.ts` |
| Integration | Vitest | tRPC-Router mit gemocktem Prisma-Client | `src/server/api/routers/tests/integration/` |
| E2E | Playwright | Nutzerabläufe: Auth, Gameshows, Rooms, Multiplayer, Smoke | `<code-ordner>/tests/e2e/` |

Regeln:

- Je mehr Logik sich als reine Funktion testen lässt, desto weniger E2E ist nötig. E2E prüft Abläufe, nicht Berechnungen.
- React-Komponenten werden nur dann per Vitest getestet, wenn sie eigene Logik enthalten (bedingte Darstellung abhängig von State, Berechnungen, Event-Handler mit Seiteneffekten). Rein darstellende Komponenten werden nicht per Vitest getestet.
- Ein Vitest-Test, der eine echte Datenbankverbindung oder einen Netzwerkaufruf an einen externen Dienst braucht, ist **nicht konform zur Unit-Ebene**. Er wird entweder auf Mocks umgestellt oder in die E2E-Ebene verlagert.
- Tests liegen immer neben dem Code, den sie prüfen, in einem Ordner `tests/` mit den Unterordnern `unit/`, `integration/` und `e2e/`. Vitest führt nur `tests/unit` und `tests/integration` aus, Playwright nur `tests/e2e`. Ordnerübergreifende Specs (Smoke, Auth-Setup) liegen in `tests/e2e/` im Projektstamm. Gemeinsames Vitest-Setup: `tests/setup.ts` und `tests/utils.ts`.

## Entscheidungstabelle

| Änderung | Unit | Integration | E2E |
|---|---|---|---|
| Neues Spiel | Spiel-Logik als `tests/unit/*.test.ts` neben der Quelldatei | – | Registry-Test läuft automatisch; Szenario in `src/games/<Spiel>/tests/e2e/<spiel>.spec.ts`, wenn das Spiel eigene Regeln hat |
| Neuer Konfigurator | Validierungslogik, falls vorhanden | – | Checkliste „Neuen Konfigurator testen“ |
| Auth-Änderung | Callbacks, falls als reine Funktion herausgelöst | – | `src/server/tests/e2e/auth.spec.ts` |
| Neuer tRPC-Router | – | Router-Test mit `vi.mocked(prisma…)` | nur bei neuem Nutzerfluss |
| UI-Änderung | keine Testebene erforderlich, außer bei komplexer Logik | – | Smoke-Test, falls eine neue Seite entsteht |

## Verzeichnisse von `e2e/`

| Verzeichnis | Zweck |
|---|---|
| `<code-ordner>/tests/e2e/` | Die Spezifikationen (`*.spec.ts`) liegen neben dem Code, den sie prüfen (z. B. `src/games/Flaggen/tests/e2e/`, `src/compositions/room/tests/e2e/`). Ordnerübergreifende Specs und das Playwright-Projekt `setup` liegen in `tests/e2e/` (`smoke/`, `setup/auth.setup.ts`). |
| `e2e/pages/` | Page Objects. Sie kapseln Locator und Aktionen einer Seite oder Komponente und enthalten keine `expect`-Aufrufe. |
| `e2e/fixtures/` | Playwright-Fixtures. `e2e/fixtures/index.ts` exportiert das erweiterte `test` und `expect`. Dort liegen u. a. `userSession`, `adminSession`, `workerSession`, `tracker` (Aufräumen), `browserErrors` und `createRoomWithPlayers`. |
| `e2e/helpers/` | Hilfsfunktionen ohne Fixture-Mechanik, z. B. Datenbank-Cleanup (`db.ts`), tRPC-Aufrufe (`trpc.ts`), `browserErrors.ts`, PartyKit-Mock. |
| `e2e/.auth/` | Gespeicherte Browser-Sessions (Storage_State) je Testkonto, z. B. `user.json`. Die Dateien sind in `.gitignore` und werden vom `setup`-Projekt erzeugt. |

Zusätzlich gibt es `e2e/support/`: reine Funktionen für Config, Env-Prüfung, Datenbank-Guard, Namen und Testfall-Ableitung. Sie werden mit Vitest und `fast-check` getestet.

## Namenskonventionen

| Gegenstand | Konvention | Beispiel |
|---|---|---|
| E2E-Tests | `*.spec.ts` in `tests/e2e/` | `src/server/tests/e2e/auth.spec.ts` |
| Page Objects | PascalCase | `e2e/pages/GameshowListPage.ts` |
| Helper | camelCase | `e2e/helpers/browserErrors.ts` |
| Vitest-Tests | `*.test.ts` in `tests/unit/` bzw. `tests/integration/` | `src/hooks/useBuzzer/tests/unit/buzzerLogic.test.ts` |
| Test_IDs (`data-testid`) | kebab-case, nur `a-z`, `0-9` und `-`, Schema `<bereich>-<element>` | `scorebar-team-one` |

Weitere Regeln für E2E-Code:

- Bezeichner (Klassen, Methoden, Variablen, Fixtures) sind englisch. UI-Texte, auf die Locator zugreifen, bleiben deutsch.
- Locator-Reihenfolge: zuerst `getByRole`, dann `getByLabel`, dann `getByTestId`. Eine Test_ID wird nur ergänzt, wenn ein Element per Rolle oder Label nicht eindeutig (genau ein Treffer) gefunden wird.
- Keine CSS-Klassen als Selektoren.
- Kein `page.waitForTimeout`. Zustände werden mit Auto-Waiting-Assertions (`expect(locator)`) geprüft, nicht mit `isVisible()` oder `textContent()` als Sofort-Assertion. ESLint erzwingt das für `e2e/` und `expect` in `e2e/pages/`.
- Gameshows, die ein Test anlegt, heißen `createE2eName()` (`e2e-` plus mindestens 8 alphanumerische Zeichen).
- Upload-Dateien liegen ausschließlich in `e2e/fixtures/files/`.

## Befehle

| Zweck | Unit / Integration (Vitest) | E2E (Playwright) |
|---|---|---|
| Einmalig lokal | `bun run test:unit` / `bun run test:integration` | `bun run test:e2e` |
| Watch bzw. interaktiv | `bun run test:unit:watch` | `bun run test:e2e:ui` |
| Sichtbarer Browser | – | `bun run test:e2e:headed` |
| Nur Smoke (`@smoke`, Chromium) | – | `bun run test:e2e:smoke` |
| Report öffnen | – | `bun run test:e2e:report` |
| In der CI | `bun run test:unit`, `bun run test:integration` | `bun run test:e2e` |

Weitere Befehle:

- `bun run lint` prüft `src/` und `e2e/`. `bun run tsc` prüft Typen inkl. `e2e/`.
- `bun run db:seed:e2e` legt die E2E-Konten an (idempotent).
- `bun run dev:e2e` startet `next dev` ohne den Dev-Seed (Playwright ruft das selbst auf).

Browser: Lokal laufen `chromium`, `firefox` und `webkit`. Ist `CI` gesetzt und `E2E_ALL_BROWSERS` leer, läuft nur `chromium`. Ein nicht leerer Wert in `E2E_ALL_BROWSERS` aktiviert alle drei Browser auch in der CI.

## Einrichtung

Einmalige Schritte für einen lokalen E2E-Lauf:

1. Browser installieren:
   ```bash
   bunx playwright install
   ```
2. `.env.test` aus der Vorlage erzeugen und anpassen (`E2E_*`-Passwörter). Das Passwort in `DATABASE_URL` muss zu `docker-compose.yml` passen (dort: `password`):
   ```bash
   cp .env.test.example .env.test
   ```
3. Tests starten:
   ```bash
   bun run test:e2e
   ```

Datenbank und Container verwaltet Playwright selbst (`e2e/support/docker.ts`): Läuft der PostgreSQL-Container aus `docker-compose.yml` nicht, wird er gestartet. Danach wird die Datenbank `the_genius_e2e` angelegt, migriert und geseedet. Nach dem Lauf wird die Datenbank gelöscht; den Container stoppt Playwright nur, wenn es ihn selbst gestartet hat. Mit `E2E_KEEP_SERVICES=true` bleibt alles stehen, mit `E2E_MANAGE_DOCKER=false` kümmerst du dich selbst um Datenbank, Migration und `bun run db:seed:e2e`.

Sicherheitsnetze: Fehlt `.env.test` oder eine Variable aus `.env.test.example`, bricht der Lauf vor dem ersten Test mit den Namen der fehlenden Variablen ab. Zeigt `DATABASE_URL` auf eine Datenbank ohne Suffix `_e2e` oder `_test`, bricht der Lauf ebenfalls ab, bevor eine Schreiboperation stattfindet. Der Dev-Seed (`bun run dev`) wird für E2E nicht benutzt, weil er Tabellen leert.

Lokal gilt `reuseExistingServer`: Läuft schon ein Server auf Port 3000 bzw. PartyKit auf Port 1999, wird er wiederverwendet. In der CI startet Playwright immer eigene Server.

## Debuggen und Codegen

Einen einzelnen Test im Playwright Inspector ausführen. Es laufen nur Tests, deren Titel zum `--grep`-Muster passt:

```bash
bunx playwright test --debug --grep "Punktestand des Moderators"
```

Tests per Aufzeichnung erzeugen:

```bash
bunx playwright codegen http://localhost:3000
```

Aufgezeichneter Code darf nicht direkt eingecheckt werden. Er wird zuerst in ein Page Object überführt (Locator nach Rolle, Label oder Test_ID, keine `expect` im Page Object).

Bei Fehlschlägen liegen Screenshot und Video unter `test-results/`. Ein Trace entsteht beim ersten Retry (`trace: "on-first-retry"`). Öffnen mit `bunx playwright show-trace <trace.zip>`.

## Authentifizierung in E2E-Läufen

Der Credentials-Login (`LocalCredentialsProvider`) ist nur mit `APP_ENV=development` aktiv. E2E-Läufe laufen deshalb immer mit Development-Umgebung. `playwright.config.ts` setzt dafür `APP_ENV=development` und `NEXT_PUBLIC_DEBUG_MODE=false` für den Webserver, damit lokale `.env.local`-Werte das Ergebnis nicht verfälschen.

Die Signin-Seite hat kein E-Mail/Passwort-Formular. Das `setup`-Projekt loggt sich pro Konto über die NextAuth-Endpunkte (`/api/auth/csrf`, `/api/auth/callback/credentials`) ein und speichert den Storage_State in `e2e/.auth/<konto>.json`. Konten: `user` (Rolle `USER`), `admin` (Rolle `ADMIN`) und `worker-0` bis `worker-3` (Rolle `PREMIUM`, je ein Konto pro Worker, weil `USER` höchstens 3 Gameshows besitzen darf).

Google und Discord werden nicht automatisiert eingeloggt. Getestet wird nur, dass die beiden Buttons auf `/auth/signin` sichtbar sind. Anfragen an PostHog, Google und Discord werden in den Fixtures blockiert.

## Checklisten

### Neues Spiel testen

- [ ] Unit-Tests der Spiel-Logik (State-Transformationen, Scoring) in `tests/unit/` neben der Quelldatei
- [ ] Eintrag in der Game_Registry (`src/games/core/games.config.ts`) und im `Game`-Enum (`src/games/core/types.ts`)
- [ ] Prisma-Migration mit `slug` identisch zum `Game`-Enum-Wert und `active: true`
- [ ] Spielspezifische E2E-Szenarien in `src/games/<Spiel>/tests/e2e/<spiel>.spec.ts` (ein regelspezifischer Spielzug oder eine Punktevergabe), sofern das Spiel eigene Regeln hat
- [ ] `src/games/core/tests/e2e/registry.spec.ts` läuft ohne Codeänderung für das neue Spiel (`picker`, `configurator`, `room`)

Fehlt die Migration oder ist der Eintrag inaktiv, schlägt der Registry-Test `<spiel>: picker` mit Spielname und Hinweis auf die Migration fehl. Die Tests der übrigen Spiele laufen weiter.

### Neuen Konfigurator testen

- [ ] Formularvalidierung: Pflichtfelder und Grenzwerte
- [ ] Standardwerte: Der neue Konfigurator zeigt `DEFAULT_STATE` korrekt an
- [ ] Speichern und Laden (Round-Trip): Eingaben sind nach erneutem Öffnen der Gameshow identisch
- [ ] Datei-Uploads nur mit Dateien aus `e2e/fixtures/files/`

## Multiplayer-Tests

Tests, die sich einen Room teilen, laufen innerhalb einer Datei seriell:

```ts
test.describe.configure({ mode: "serial" });
```

Die Fixture `createRoomWithPlayers(n)` erzeugt Gameshow und Room und liefert `n` (1 bis 5) anonyme Player_Contexts. Ein Wert außerhalb von 1 bis 5 wird abgelehnt, bevor etwas angelegt wird. Vor dem Start prüft die Fixture innerhalb von 5 Sekunden, ob der PartyKit-Server unter `localhost:1999` erreichbar ist, und schlägt sonst sofort mit einer klaren Meldung fehl.

## Flaky-Tests

Vorgehen in dieser Reihenfolge:

1. Ursache analysieren (Trace, Video, Race Condition, geteilte Testdaten).
2. Den Test mit `test.fixme` markieren.
3. Ein Ticket anlegen und im Code-Kommentar referenzieren.

Das dauerhafte Erhöhen von Timeouts ist keine zulässige Maßnahme. Die CI wiederholt fehlgeschlagene Tests höchstens zweimal, damit Traces entstehen. Ein Test, der erst im Retry besteht, gilt als „flaky“ und lässt den Job trotzdem fehlschlagen (`failOnFlakyTests`).

## CI, Secrets und GitHub-Environment

Der Workflow `.github/workflows/build_and_test.yml` hat den Job `e2e`. Er läuft als Matrix mit einem Job pro Suite (`smoke`, `auth`, `gameshows`, `room`, `games`), jeder auf eigenem Runner mit eigener Datenbank, ohne `needs` parallel zu den anderen Jobs, mit `timeout-minutes: 20`. Die Datenbank kommt wie lokal aus `docker-compose.yml`; Playwright startet sie, legt `the_genius_e2e` an, migriert und seedet. Das Job-`env` setzt `DATABASE_URL`, `APP_ENV=development`, `NEXT_PUBLIC_PARTYKIT_HOST` und `NEXT_PUBLIC_DEBUG_MODE`. Die Schritte: `prisma generate`, Playwright-Browser-Cache (Schlüssel nach Playwright-Version), `bun run test:e2e`. Der HTML-Report wird immer, `test-results/` (Traces) nur bei Fehlschlag als Artefakt hochgeladen (14 Tage Aufbewahrung).

Zugangsdaten für E2E: Die Konten existieren nur in der Wegwerf-Datenbank des Jobs. Deshalb braucht die CI keine Secrets; der Workflow setzt feste Standardwerte für `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`, `E2E_ADMIN_EMAIL` und `E2E_ADMIN_PASSWORD`. Ein GitHub-Secret mit gleichem Namen (Repository oder Environment, siehe `inputs.environment`) überschreibt den Standardwert.

Wichtig: `DATABASE_URL` des Jobs muss auf die Test-Datenbank zeigen, nicht auf das Secret `DATABASE_URL` der übrigen Jobs. Die Config bricht bei einem Datenbanknamen ohne `_e2e` oder `_test` ab.

## Referenztests

Vorlagen für neue Tests, je Bereich:

| Bereich | Referenztest | Datei |
|---|---|---|
| Auth | „leitet anonyme Besucher ohne callbackUrl auf /auth/signin weiter“ | `src/server/tests/e2e/auth.spec.ts` |
| Smoke | „öffentliche Seite … lädt fehlerfrei“ (Tag `@smoke`) | `tests/e2e/smoke/pages.spec.ts` |
| Gameshow-Konfigurator | „neue Gameshow erscheint in der Liste und zeigt Erfolgsmeldung“ | `src/compositions/gameshows/tests/e2e/gameshow.spec.ts` |
| Spiele-Registry | „<identifier>: picker“ (parametrisiert) | `src/games/core/tests/e2e/registry.spec.ts` |
| Room | „Punktestand des Moderators erscheint bei allen Spielern“ | `src/compositions/room/tests/e2e/multiplayer.spec.ts` |

## Beispiele für Unit- und Integrationstests

Alle vier Beispiele wurden mit `bun run test:unit` ausgeführt und bestehen. Vitest-Globals (`describe`, `it`, `expect`, `vi`) sind aktiv, ein Import ist nicht nötig. Der Prisma-Client ist global gemockt (`tests/setup.ts`).

### Spiel-Logik

```ts
import {
  applyBuzzerPress,
  createInitialRoomBuzzerState,
  lockBuzzer
} from "~/utils/buzzerLogic";

describe("applyBuzzerPress", () => {
  it("activates the pressing team on an unlocked buzzer", () => {
    const state = createInitialRoomBuzzerState();

    const next = applyBuzzerPress(state, "teamOne");

    expect(next.teams.teamOne.isActiveTurn).toBe(true);
    expect(next.teams.teamTwo.isActiveTurn).toBe(false);
  });

  it("ignores a press while the team buzzer is locked", () => {
    const locked = lockBuzzer(createInitialRoomBuzzerState(), "teamOne");

    expect(applyBuzzerPress(locked, "teamOne")).toBe(locked);
  });
});
```

### tRPC-Router mit gemocktem Prisma

`getTestCaller` (aus `tests/utils.ts`) ruft den Router ohne HTTP auf. Die Gameshows kommen aus `__mock__/mockGameshows.ts`. Für eigene Rückgabewerte wird der Mock pro Test konfiguriert, z. B. `vi.mocked(prisma.gameshow.count).mockResolvedValueOnce(3)`.

```ts
import { getTestCaller } from "tests/utils";

const session = {
  user: { id: "1", role: "USER" as const, username: "testuser", email: "" },
  expires: "2100-01-01T00:00:00.000Z"
};

describe("gameshowsRouter -> getById", () => {
  it("rejects anonymous callers", async () => {
    const caller = getTestCaller(null);

    await expect(
      caller.gameshows.getById({ gameshowId: "1" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns NOT_FOUND for a gameshow of another user", async () => {
    const caller = getTestCaller(session);

    await expect(
      caller.gameshows.getById({ gameshowId: "3" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
```

### Komponente mit Logik

Das Repo hat keine DOM-Testumgebung (kein `jsdom`, keine Testing Library). Komponenten mit Logik werden deshalb serverseitig mit `renderToStaticMarkup` gerendert. Hooks werden mit `vi.mock` ersetzt, Mantine-Komponenten brauchen den `MantineProvider`. Die Testdatei trägt die Endung `.test.tsx`.

```tsx
import { MantineProvider } from "@mantine/core";
import { renderToStaticMarkup } from "react-dom/server";
import TeamScore from "~/games/ZehnSetzen/components/TeamScore";
import { useUser } from "~/hooks/useUser";

vi.mock("~/hooks/useUser");

const renderOpacity = (isDisplayed: boolean) => {
  const html = renderToStaticMarkup(
    <MantineProvider>
      <TeamScore teamId="t1" isDisplayed={isDisplayed} score={7} />
    </MantineProvider>
  );
  return /opacity:([\d.]+)/.exec(html)?.[1];
};

describe("TeamScore", () => {
  it("dims the score of an opponent for the host, hides it from players", () => {
    const user = (isHost: boolean) =>
      ({ team: { id: "t2" }, isPlayer: !isHost, isHost }) as ReturnType<
        typeof useUser
      >;

    vi.mocked(useUser).mockReturnValue(user(true));
    expect(renderOpacity(false)).toBe("0.5");

    vi.mocked(useUser).mockReturnValue(user(false));
    expect(renderOpacity(false)).toBe("0");
  });
});
```

### Eigenschaften mit `fast-check`

Property-Based Testing wird für reine Funktionen eingesetzt (Scoring, State-Übergänge). Werkzeug ist `fast-check`. Mindestens 100 Durchläufe (`numRuns: 100`).

```ts
import fc from "fast-check";
import {
  applyBuzzerPress,
  createInitialRoomBuzzerState,
  type TeamKey
} from "~/utils/buzzerLogic";

describe("applyBuzzerPress (property)", () => {
  it("never activates more than one team, whatever the press order", () => {
    const team = fc.constantFrom<TeamKey>("teamOne", "teamTwo");

    fc.assert(
      fc.property(fc.array(team, { maxLength: 20 }), (presses) => {
        const end = presses.reduce(
          applyBuzzerPress,
          createInitialRoomBuzzerState()
        );
        const active = Object.values(end.teams).filter((t) => t.isActiveTurn);

        return active.length <= 1;
      }),
      { numRuns: 100 }
    );
  });
});
```
