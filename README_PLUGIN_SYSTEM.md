# Neues Spiel hinzufügen - Plugin-System

Mit dem neuen Plugin-System reduzieren Sie die Anpassungsstellen von **7 auf 3**!

## Schritt 1: Game Enum erweitern

Fügen Sie Ihr neues Spiel zum `Game` Enum hinzu:

```typescript
// src/components/room/Game/games/game.types.ts
export enum Game {
  FLAGGEN = "flaggen",
  GEHEIMWOERTER = "geheimwoerter",
  MERKEN = "merken",
  SET = "set",
  DUSAGST = "duSagst",
  REFERATBINGO = "referatBingo",
  ZEHN_SETZEN = "zehnSetzen",
  MEIN_NEUES_SPIEL = "meinNeuesSpiel" // 👈 HINZUFÜGEN
}
```

## Schritt 2: TGameSettingsMap erweitern

Erweitern Sie die TGameSettingsMap:

```typescript
// src/components/room/Game/games/game.types.ts
export type TGameSettingsMap = {
  flaggen: TFlaggenGameState;
  merken: TMerkenGameState;
  geheimwoerter: TGeheimwörterGameState;
  set: TSetGameState;
  duSagst: TDuSagstGameState;
  referatBingo: TReferatBingoGameState;
  zehnSetzen: TZehnSetzenGameState;
  meinNeuesSpiel: TMeinNeuesSpielGameState; // 👈 HINZUFÜGEN
};
```

## Schritt 3: Erstellen Sie das Plugin

Erstellen Sie eine `plugin.ts` Datei in Ihrem Spiel-Ordner:

```typescript
// src/components/room/Game/games/MeinNeuesSpiel/plugin.ts
import type { GamePlugin } from "../plugin-system";
import { Game } from "../game.types";
import { DEFAULT_MEIN_NEUES_SPIEL_STATE } from "./config";
import MeinNeuesSpielConfigurator from "~/components/gameshows/MeinNeuesSpielConfigurator";
import MeinNeuesSpielGame from "./MeinNeuesSpielGame";

export const meinNeuesSpielPlugin: GamePlugin = {
  identifier: Game.MEIN_NEUES_SPIEL,
  name: "Mein neues Spiel",
  defaultConfig: DEFAULT_MEIN_NEUES_SPIEL_STATE,
  configurator: MeinNeuesSpielConfigurator,
  gameComponent: MeinNeuesSpielGame as unknown as GamePlugin["gameComponent"],
  handlers: undefined // oder spezielle Handler falls benötigt
};
```

## Schritt 4: Registrieren Sie das Plugin

Fügen Sie **eine Zeile** zur `game-registry.ts` hinzu:

```typescript
// src/components/room/Game/games/game-registry.ts
import { meinNeuesSpielPlugin } from "./MeinNeuesSpiel/plugin";

function registerAllPlugins() {
  // ... existing plugins
  GamePluginManager.registerPlugin(meinNeuesSpielPlugin); // 👈 NUR DIESE ZEILE HINZUFÜGEN!
}
```

## Das war's! 🎉

Das Plugin-System kümmert sich automatisch um:
- ✅ Hinzufügung zur `GAME_STATE_MAP`
- ✅ Hinzufügung zur `GAME_CONFIGURATORS`
- ✅ Hinzufügung zur `GAME_COMPONENTS`
- ✅ Verfügbarkeit in allen UI-Komponenten

## Vorher vs. Nachher

### ❌ Vorher: 7 Stellen
1. Game Enum erweitern
2. TGameSettingsMap erweitern
3. Default State erstellen
4. GAME_STATE_MAP erweitern
5. GAME_CONFIGURATORS erweitern
6. Configurator erstellen
7. TGameMap erweitern
8. Game Component erstellen

### ✅ Nachher: 3 Stellen
1. Game Enum erweitern
2. TGameSettingsMap erweitern
3. Plugin erstellen + registrieren

**Reduzierung: 7 Stellen → 3 Stellen** (57% weniger Arbeit!)

## Warum noch Enum/TGameSettingsMap?

Das Game Enum und die TGameSettingsMap sind fundamentale TypeScript-Typen, die:
- **Typsicherheit** gewährleisten
- **Intellisense** ermöglichen  
- **Compile-time checks** durchführen
- In vielen anderen Teilen der Anwendung verwendet werden

Das Plugin-System eliminiert die **manuellen Map-Verwaltungen**, aber die grundlegenden Typen müssen definiert bleiben.
