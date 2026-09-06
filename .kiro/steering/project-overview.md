# TheGenius – Projektübersicht

TheGenius ist eine **Multiplayer-Gameshow-Plattform**. Nutzer erstellen eigene Gameshows und spielen sie mit Freunden in Echtzeit. Das Projekt ist inspiriert von "Brain Battle" des deutschen YouTube-Kanals PietSmiet.

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js (Pages Router) + React 18 |
| Sprache | TypeScript (strict) |
| Package Manager | **Bun** (nicht npm/yarn) |
| API | tRPC v10 + React Query v4 |
| Datenbank | PostgreSQL über Prisma v5 |
| Auth | NextAuth v4 (Google, Discord; Local nur in Dev) |
| Realtime | PartyKit + Yjs (CRDTs) |
| UI | **Mantine v7** (kein Tailwind) |
| State | useImmer / Immer, SyncedStore |
| Testing | Vitest v2 |
| Deployment | Railway (Nixpacks) |
| Analytics | PostHog |

## Kernkonzepte

- **Gameshow**: Eine vom User erstellte Sammlung von Spielen (gespeichert als `Json[]` in PostgreSQL)
- **Room**: Eine Live-Spielsitzung mit Teams, Buzzer, Scoreboard, Sounds und Moderator-Controls
- **Game**: Ein einzelnes Minispiel (z. B. DuSagst, Flaggen, ZehnSetzen) mit eigenem State und Konfigurator
- **PartyKit + Yjs**: Echtzeit-CRDT-State-Sync zwischen allen Room-Teilnehmern

## Verzeichnisstruktur (wichtigste Bereiche)

```
src/
├── components/     UI-Komponenten (nach Feature gruppiert)
├── config/         App-weite Konfigurationen
├── context/        React Contexts (GameConfig, SyncedRoom, Stepper)
├── games/          Spiellogik – core/ + je ein Ordner pro Spiel
├── hooks/          Custom React Hooks
├── pages/          Next.js Pages Router
│   └── api/        tRPC-Handler + NextAuth
├── server/         Server-only Code (tRPC-Router, Auth, Prisma, Classes)
├── types/          Geteilte TypeScript-Typen
└── utils/          Hilfsfunktionen
prisma/             Prisma Schema (PostgreSQL, aufgeteilt in models/)
party/              PartyKit Server
__tests__/          Vitest Setup + Utilities
__mock__/           Mock-Daten für Tests
```

## Umgebungen

- `development` – lokale Entwicklung mit Docker PostgreSQL, JWT-Sessions, Local-Credentials-Provider
- `staging` – Railway Staging (`the-genius-staging.up.railway.app`)
- `production` – Railway Production, Database-Sessions

## Lokale Entwicklung starten

```bash
# PostgreSQL starten
docker-compose -f local/compose.yml up -d

# Dependencies installieren
bun install

# Next.js starten
bun run dev

# PartyKit lokal starten (separates Terminal)
bun run partykit
```

Ports: Next.js auf 3000, PostgreSQL auf 5432, Prisma Studio auf 4466.
