# Release Prozess

> ⚠️ **Erste Einrichtung:** Stelle sicher, dass der Bot die nötigen Rechte hat um auf `staging` zu pushen.  
> Siehe [BOT_PERMISSIONS_SETUP.md](./BOT_PERMISSIONS_SETUP.md) für die Einrichtung.

## Automatischer Release-Flow

Der Release-Prozess läuft vollautomatisch ab, wenn ein Merge Request von `staging` → `production` erstellt wird.

### Workflow

1. **Pull Request erstellen** (staging → production)
   - Erstelle einen PR von `staging` nach `production`
   - Der Workflow `version-bump-on-pr.yml` wird automatisch ausgeführt

2. **Automatische Versionierung**
   - Die App-Version wird automatisch erhöht
   - Standard: **patch** release (z.B. 0.2.0 → 0.2.1)
   - Ein Commit mit der neuen Version wird zum PR hinzugefügt

3. **Merge Request**
   - Merge den PR in `production`
   - Der Workflow `create-release-tag.yml` wird automatisch ausgeführt

4. **Automatisches Tagging**
   - Ein Git-Tag wird erstellt (z.B. `v0.2.1`)
   - Ein GitHub Release wird erstellt mit Changelog

---

## Version Bump Type festlegen

### Standard (Patch Release)
Ohne weitere Angaben wird automatisch ein **patch** release gemacht:
- `0.2.0` → `0.2.1`
- Für Bug Fixes und kleine Änderungen

### Minor Release
Füge `[minor]` im PR-Titel oder Body hinzu:
```
[minor] Add new feature X
```
oder füge ein Label `minor` zum PR hinzu
- `0.2.0` → `0.3.0`
- Für neue Features (rückwärtskompatibel)

### Major Release
Füge `[major]` im PR-Titel oder Body hinzu:
```
[major] Breaking change: New authentication system
```
oder füge ein Label `major` zum PR hinzu
- `0.2.0` → `1.0.0`
- Für Breaking Changes

---

## Beispiele

### Patch Release (Standard)
```bash
# PR-Titel
Deploy staging to production

# Ergebnis: 0.2.0 → 0.2.1
```

### Minor Release
```bash
# PR-Titel
[minor] Add dark mode and new dashboard

# Ergebnis: 0.2.0 → 0.3.0
```

### Major Release
```bash
# PR-Titel  
[major] Breaking: New API structure

# Ergebnis: 0.2.0 → 1.0.0
```

---

## Was passiert automatisch?

✅ Version wird in `package.json` erhöht  
✅ Commit wird zum PR hinzugefügt  
✅ Nach dem Merge wird Git-Tag erstellt  
✅ GitHub Release wird erstellt mit Changelog  
✅ Keine manuelle Aktion nötig!

---

## Übersicht der Workflows

### `version-bump-on-pr.yml`
- **Trigger:** PR von `staging` → `production`
- **Aktion:** Version erhöhen und committen

### `create-release-tag.yml`
- **Trigger:** Push zu `production` branch
- **Aktion:** Git-Tag und GitHub Release erstellen

---

## Wichtige Hinweise

⚠️ **Der PR-Branch muss genau `staging` heißen**, sonst wird die Versionierung nicht ausgeführt

⚠️ **Keine manuellen Version-Änderungen** in PRs vornehmen - das geschieht automatisch

⚠️ **Tags werden nur erstellt**, wenn die Version in package.json sich geändert hat

✅ **Der Prozess ist idempotent** - kann gefahrlos mehrfach ausgeführt werden
