# Games-System Dokumentation

## 📁 Neue Struktur

Die Games und deren Konfiguratoren sind jetzt in einem zentralen `src/games/` Ordner organisiert:

```
src/games/
├── core/                    # Kern-System für alle Games
│   ├── types.ts            # Basis-Typen für alle Games
│   ├── plugin-system.ts    # Plugin-System
│   ├── registry.ts         # Zentrale Registry für alle Games
│   └── constants.ts        # Exportierte Konstanten
├── Merken/                 # Game: Merken
│   ├── index.ts           # Haupt-Export
│   ├── types.ts           # Game-spezifische Typen
│   ├── config.ts          # Default-Konfiguration
│   ├── game.tsx           # Game-Komponente
│   ├── configurator.tsx   # Konfigurator-Komponente
│   ├── plugin.ts          # Plugin-Definition
│   └── components/        # Game-spezifische Komponenten
│       └── MerkenPlayground.tsx
├── Flaggen/               # Game: Flaggen (noch zu migrieren)
├── Set/                   # Game: Set (noch zu migrieren)
└── ... (weitere Games)
```

## 🎯 Vorteile der neuen Struktur

### ✅ Gebündelte Organisation

- **Games und Konfiguratoren** sind am selben Ort
- **Komponenten** sind logisch gruppiert
- **Einfacher zu finden** und zu bearbeiten

### ✅ Plugin-System

- **Reduzierte Anpassungsstellen**: 7 Stellen → 3 Stellen
- **Automatische Integration** in bestehende Systeme
- **Konsistente Struktur** für alle Games

### ✅ Type-Safety

- **Bessere TypeScript-Integration**
- **Zentrale Type-Definitionen**
- **Weniger Duplikation**

## 🚀 Neues Game hinzufügen

### 1. Game-Ordner erstellen

```
src/games/MeinSpiel/
├── index.ts
├── types.ts
├── config.ts
├── game.tsx
├── configurator.tsx
├── plugin.ts
└── components/
```

### 2. Plugin erstellen

```typescript
// src/games/MeinSpiel/plugin.ts
export const meinSpielPlugin: GamePlugin = {
  identifier: Game.MEIN_SPIEL,
  name: "Mein Spiel",
  defaultState: DEFAULT_MEIN_SPIEL_STATE,
  configurator: MeinSpielConfigurator,
  gameComponent: MeinSpielGame,
  handlers: undefined
};
```

### 3. Plugin registrieren

```typescript
// src/games/core/registry.ts
import { meinSpielPlugin } from "../MeinSpiel/plugin";

function registerAllPlugins() {
  GamePluginManager.registerPlugin(meinSpielPlugin);
  // ... andere Plugins
}
```

## 📦 Migration Status

### ✅ Abgeschlossen

- [x] Core-System erstellt
- [x] Merken-Game migriert
- [x] Plugin-System implementiert

### 🔄 In Bearbeitung

- [ ] Flaggen-Game migrieren
- [ ] Set-Game migrieren
- [ ] DuSagst-Game migrieren
- [ ] Geheimwörter-Game migrieren
- [ ] ReferatBingo-Game migrieren
- [ ] ZehnSetzen-Game migrieren

### 🎯 Nächste Schritte

1. **Bestehende Imports aktualisieren** auf neue Struktur
2. **Alte Ordner entfernen** nach vollständiger Migration
3. **Tests anpassen** für neue Struktur
4. **Dokumentation vervollständigen**

## 🔗 Verwendung

### Games importieren

```typescript
// Neue Art - alles zentral
import { Game, GAME_COMPONENTS, GAME_CONFIGURATORS } from "~/games";

// Spezifisches Game
import { MerkenGame, MerkenConfigurator } from "~/games/Merken";
```

### Plugin-System nutzen

```typescript
import { GamePluginManager } from "~/games";

// Alle Games abrufen
const allGames = GamePluginManager.getAllPlugins();

// Spezifisches Game abrufen
const merkenPlugin = GamePluginManager.getPlugin(Game.MERKEN);
```

## 📋 Checkliste für Migration

Beim Migrieren eines neuen Games:

- [ ] Game-Ordner in `src/games/` erstellen
- [ ] `types.ts` - Game-spezifische Typen definieren
- [ ] `config.ts` - Default-Konfiguration erstellen
- [ ] `game.tsx` - Game-Komponente kopieren/anpassen
- [ ] `configurator.tsx` - Konfigurator kopieren/anpassen
- [ ] `plugin.ts` - Plugin-Definition erstellen
- [ ] `index.ts` - Exports definieren
- [ ] Plugin in `core/registry.ts` registrieren
- [ ] Komponenten in `components/` verschieben
- [ ] Imports aktualisieren
- [ ] Tests anpassen
