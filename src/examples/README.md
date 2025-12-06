# 🎮 Beispiel Spiel & Konfigurator

Dieses Verzeichnis enthält ein vollständiges Beispiel für die Implementierung eines neuen Spiels mit Konfigurator im TheGenius System.

## 📁 Struktur

```
examples/
├── ExampleGame/                    # Das Spiel selbst
│   ├── examplegame.types.ts       # TypeScript Interfaces
│   ├── config.ts                  # Default State & Konfiguration
│   ├── ExampleGameGame.tsx        # Spiel-Komponente
│   └── index.ts                   # Exports
└── ExampleGameConfigurator/        # Der Konfigurator
    └── ExampleGameConfigurator.tsx # Konfigurator mit useGameshowConfig Hook
```

## 🎯 Was dieses Beispiel zeigt

### 1. **Spiel-Struktur** (`ExampleGame/`)

- ✅ Korrekte TypeScript Interface Definition
- ✅ Default State mit Handlebars Rules Template
- ✅ Vollständige React Game-Komponente mit Mantine UI
- ✅ Timer-Funktionalität und Interaktivität

### 2. **Konfigurator** (`ExampleGameConfigurator/`)

- ✅ **useGameshowConfig Hook Verwendung**
- ✅ Automatische State-Persistierung
- ✅ Type-safe Updates
- ✅ Intuitive UI mit Mantine Components

## 🚀 useGameshowConfig Hook Beispiel

Der Konfigurator zeigt die **korrekte Verwendung** des `useGameshowConfig` Hooks:

```typescript
const { updateGame, [GAME_ID]: gameState } = useGameshowConfig(GAME_ID);

// State Updates
const updateGameState = (updates) => {
  updateGame((draft) => {
    Object.assign(draft, updates);
  });
};
```

## 🔧 Features im Beispiel

### Spiel-Features:

- 📝 Fragen mit Antworten und Punktzahlen
- ⏱️ Timer-System mit automatischer Antwort-Anzeige
- 🎯 Verschiedene Spielmodi (Rapid Fire, Denkzeit, Buzzer)
- 📊 Fortschrittsanzeige
- 🎨 Responsive UI mit Mantine Components

### Konfigurator-Features:

- ⚙️ Grundeinstellungen (Modus, Schwierigkeit, Timer)
- 📝 Dynamisches Hinzufügen/Bearbeiten/Löschen von Fragen
- 🏷️ Kategorie-Management
- 💾 Automatische Speicherung im Gameshow-Context
- 🔒 Type-safe Updates

## 📋 Verwendung als Template

1. **Kopiere die Struktur** in deinen eigenen Game-Ordner
2. **Benenne die Komponenten um** (ExampleGame → DeinSpielName)
3. **Passe die Interfaces an** in `yourgame.types.ts`
4. **Definiere deinen Default State** in `config.ts`
5. **Implementiere deine Game-Logik** in der Game-Komponente
6. **Erstelle deinen Konfigurator** mit dem useGameshowConfig Hook
7. **Registriere das Spiel** in der games.config.ts

## ✨ Best Practices gezeigt

- 🎯 **Saubere TypeScript Typisierung**
- 🎨 **Konsistente Mantine UI Verwendung**
- 🔄 **Korrekte Hook-Verwendung für State Management**
- 📱 **Responsive Design**
- ⚡ **Performance-optimierte Updates**
- 🛡️ **Fehlerbehandlung und Fallbacks**

## 🔗 Integration ins System

Um dieses Beispiel in das echte System zu integrieren:

1. **Game Enum erweitern** in `core/types.ts`
2. **TGameSettingsMap erweitern** in `core/types.ts`
3. **In games.config.ts registrieren**

Dann funktioniert alles automatisch! 🚀
