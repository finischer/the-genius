# Architektur & Patterns

## API Layer: tRPC

Alle Server-Client-Kommunikation läuft über tRPC. Kein direktes `fetch` zu internen Endpunkten.

```
src/server/api/
├── root.ts          # Root-Router (kombiniert alle Sub-Router)
├── trpc.ts          # tRPC Context, Middleware, Prozedur-Helpers
└── routers/         # Feature-Router (z. B. gameshow.ts, room.ts, user.ts)
```

**Router erstellen:**

```ts
// src/server/api/routers/example.ts
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";
import { z } from "zod";

export const exampleRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.game.findUnique({ where: { id: input.id } });
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // ctx.session.user ist hier garantiert vorhanden
    })
});
```

**Client-seitig verwenden:**

```ts
const { data } = api.example.getById.useQuery({ id: "123" });
const mutation = api.example.create.useMutation();
```

## Datenbankzugriff: Prisma

- Prisma Client Singleton in `src/server/db/`
- MongoDB als Provider
- Schema in `prisma/schema.prisma`
- Nach Schema-Änderungen: `bunx prisma generate` ausführen
- Neue Spiele müssen **manuell** in die MongoDB `Game`-Collection eingetragen werden (slug muss exakt mit `Game`-Enum übereinstimmen)

## Realtime: PartyKit + Yjs

```
party/index.ts       # PartyKit Server (Cloudflare Durable Objects)
```

- `SyncedRoomContext` stellt den geteilten Yjs-Store bereit
- `useSyncedRoom` Hook für Zugriff auf Live-Room-State in Komponenten
- State-Mutationen nur über den definierten Store-Interface, nie direkt

```ts
const { store, room } = useSyncedRoom();
// store.teams.teamOne.totalScore direkt mutierbar (Yjs/Immer-Proxy)
```

PartyKit lokal starten:

```bash
bun run partykit
```

Host für lokale Entwicklung in `.env.local` als `NEXT_PUBLIC_PARTYKIT_HOST` setzen.

## Auth: NextAuth

- `src/server/auth.ts` — zentrale Auth-Konfiguration
- `getServerAuthSession(ctx)` für Server-Side session access
- In tRPC: `ctx.session` in `protectedProcedure` immer vorhanden
- Rollen: `USER`, `ADMIN`, `PREMIUM`, `GUEST` (via `UserRole` Enum)

```ts
// Rolle prüfen
if (session.user.role !== UserRole.ADMIN)
  throw new TRPCError({ code: "FORBIDDEN" });
```

## State Management

| Scope                 | Lösung                           |
| --------------------- | -------------------------------- |
| Server State (API)    | React Query via tRPC             |
| Realtime Room State   | Yjs / SyncedStore via PartyKit   |
| Gameshow-Konfigurator | `useGameshowConfig` Hook + Immer |
| Lokaler UI State      | `useState` / `useImmer`          |

## Umgebungsvariablen

Immer über `~/env.mjs` importieren — niemals direkt `process.env`:

```ts
import { env } from "~/env.mjs";
const uri = env.DATABASE_URL; // type-safe, validiert via Zod
```

Neue Env-Vars müssen in `src/env.mjs` im Schema und in `runtimeEnv` eingetragen werden.

## Spiele registrieren

Ein neues Spiel erfordert diese Schritte (in dieser Reihenfolge):

1. `src/games/GameName/` mit Types, Config, Component, Index anlegen
2. `Game`-Enum in `src/games/core/types.ts` erweitern
3. `TGameSettingsMap` in `src/games/core/types.ts` erweitern
4. In `src/games/core/games.config.ts` registrieren
5. Konfigurator unter `src/components/gameshows/GameNameConfigurator/` anlegen
6. MongoDB `Game`-Collection: Dokument manuell einfügen (slug = Enum-Wert, `active: true`, `rules: ""`)

Ohne Schritt 6 erscheint das Spiel **nicht** im GamesPicker.
