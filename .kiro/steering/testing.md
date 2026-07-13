# Testing

## Wichtig: Tests nur auf explizite Anfrage

**Tests werden nur geschrieben, wenn der User dies explizit verlangt.** Kein automatisches Schreiben von Tests als Teil von Feature-Implementierungen, Refactorings oder anderen Aufgaben.

## Framework

**Vitest v2** — konfiguriert in `vitest.config.ts`.

```bash
bun run test:unit          # Einmalig ausführen (für CI)
bun run test:unit:watch    # Watch-Mode für Entwicklung
```

## Konfiguration

- `globals: true` — `describe`, `it`, `expect`, `vi` sind global verfügbar, kein Import nötig
- Setup-Datei: `__tests__/setup.ts` (mockt den Prisma Client)
- Path-Alias `~/` → `./src/` (identisch zu tsconfig)
- E2E-Tests (`**/e2e/**`) sind ausgeschlossen

## Dateistruktur

```
__tests__/
└── setup.ts          # Globales Setup (Prisma Mock)

__mock__/
├── mockGameshows.ts  # Test-Fixtures für Gameshows
└── mockUsers.ts      # Test-Fixtures für User

src/**/__tests__/     # Unit-Tests neben dem zu testenden Code
```

Tests liegen entweder in `__tests__/` im Projektstamm oder direkt neben den Quelldateien in einem `__tests__/`-Verzeichnis.

## Test schreiben

```ts
// Kein Import von describe/it/expect nötig (globals: true)
describe("getTeamScore", () => {
  it("returns 0 for empty team", () => {
    const result = getTeamScore([]);
    expect(result).toBe(0);
  });
});
```

## Was testen

- **Utility-Funktionen** in `src/utils/` → Unit Tests
- **Spiel-Logik** (State-Transformationen, Scoring) → Unit Tests
- **tRPC-Router** → Integration Tests mit gemocktem Prisma
- **React-Komponenten** → nur bei komplexer Logik, nicht für pure UI

## Mocking

Prisma ist global gemockt (`__tests__/setup.ts`). Für tRPC-Router-Tests den Mock über `vi.mocked()` konfigurieren:

```ts
import { prisma } from "~/server/db";
vi.mocked(prisma.game.findMany).mockResolvedValue([...mockGames]);
```
