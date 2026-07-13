# Code Style & Konventionen

## TypeScript

- Strict Mode ist aktiv — kein `any` ohne triftigen Grund (ESLint warnt)
- `noUncheckedIndexedAccess` ist aktiv — Array-Zugriffe immer absichern
- `verbatimModuleSyntax: true` — Type-only Imports **müssen** `import type` oder inline `type` verwenden:
  ```ts
  // ✅
  import { type MyType } from "~/types/foo";
  import type { MyType } from "~/types/foo";
  
  // ❌
  import { MyType } from "~/types/foo";
  ```
- Path-Alias `~/` zeigt auf `./src/` — immer verwenden statt relativer `../../`-Pfade
- Ungenutzte Variablen sind ein Fehler; Ausnahme: Prefix `_` (z. B. `_unusedParam`)

## Formatierung (Prettier)

```json
{
  "trailingComma": "none",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "printWidth": 80
}
```

Keine trailing commas, doppelte Anführungszeichen, 2-Spaces-Einrückung.

## ESLint

Konfiguration in `eslint.config.cjs` (Flat Config Format).

- `@typescript-eslint/recommended` + `recommended-requiring-type-checking` aktiv
- `eslint-plugin-unused-imports` — ungenutzte Imports werden automatisch entfernt
- `src/examples/**` ist vom Linting ausgenommen

Linting ausführen:
```bash
bun run lint          # Prüfen
bun run lint:fix      # Automatisch fixen
```

## Naming Conventions

| Was | Konvention | Beispiel |
|---|---|---|
| React-Komponenten | PascalCase | `GameCard.tsx` |
| Hooks | camelCase mit `use`-Prefix | `useGameshowConfig.ts` |
| Interfaces | PascalCase mit `I`-Prefix | `IGameGeneralState` |
| Types | PascalCase mit `T`-Prefix | `TGameSettingsMap` |
| Enums | PascalCase | `UserRole`, `Game` |
| Utility-Funktionen | camelCase | `getTeamScore()` |
| Konstanten | SCREAMING_SNAKE_CASE | `DEFAULT_YOUR_GAME_STATE` |
| Dateien (non-component) | camelCase | `gameHelpers.ts` |

## Komponenten-Struktur

```
src/components/FeatureName/
├── ComponentName/
│   ├── ComponentName.tsx     # Haupt-Komponente
│   └── index.ts              # Re-export
```

Jede Komponente in eigenem Verzeichnis, Export über `index.ts`.

## Spiel-Architektur

Jedes Spiel ist ein eigenständiges Modul unter `src/games/GameName/`:
```
src/games/YourGame/
├── yourgame.types.ts    # IYourGameState Interface
├── config.ts            # DEFAULT_STATE + TYourGameState
├── YourGameGame.tsx     # Spielkomponente
└── index.ts             # Re-exports
```

Der dazugehörige Konfigurator liegt unter:
```
src/components/gameshows/YourGameConfigurator/
└── YourGameConfigurator.tsx
```

## Kommentare

- Kommentare **vermeiden**, wenn der Code selbsterklärend ist — gute Benennung schlägt jeden Kommentar
- Kommentare nur für nicht-offensichtliche Logik, komplexe Algorithmen oder wichtige Kontextinformationen
- Alle Kommentare auf **Englisch**

```ts
// ✅ Kommentar sinnvoll — erklärt nicht-offensichtliches Verhalten
// PartyKit requires a stable room ID derived from the gameshow, not the user session
const roomId = generateRoomId(gameshowId);

// ❌ Kommentar überflüssig — Code spricht für sich
// increment the score by one
score++;

// ❌ Kommentar auf Deutsch
// Berechne den Gesamtscore des Teams
const total = calculateTeamScore(team);
```

JSDoc nur für öffentliche Utility-Funktionen und komplexe Typen, nicht für React-Komponenten oder triviale Funktionen.

## Server vs. Client Code

- `src/server/` enthält **ausschließlich** server-seitigen Code (nie in Client-Komponenten importieren)
- `src/pages/api/` enthält tRPC-Handler und NextAuth
- Für Umgebungsvariablen immer `~/env.mjs` importieren (type-safe via `@t3-oss/env-nextjs`)
- Client-seitige Env-Vars müssen mit `NEXT_PUBLIC_` prefixed sein
