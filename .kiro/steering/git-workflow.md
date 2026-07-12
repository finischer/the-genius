# Git Workflow & Commit-Konventionen

## Conventional Commits

Alle Commits **müssen** dem Conventional Commits Format folgen. Husky erzwingt dies via `commit-msg` Hook mit commitlint.

```
<type>: <beschreibung>
```

### Erlaubte Types

| Type | Verwendung |
|---|---|
| `feat` | Neues Feature |
| `fix` | Bugfix |
| `refactor` | Code-Umbau ohne Verhaltensänderung |
| `docs` | Nur Dokumentation |
| `style` | Formatierung, kein Logik-Change |
| `test` | Tests hinzufügen oder anpassen |
| `perf` | Performance-Verbesserung |
| `ci` | CI/CD-Konfiguration |
| `chore` | Build-Prozess, Dependencies, Tooling |
| `ticket` | Ticket-bezogene Änderungen |
| `revert` | Commit rückgängig machen |

### Beispiele

```bash
git commit -m "feat: add zehn-setzen game configurator"
git commit -m "fix: resolve buzzer lock state not resetting"
git commit -m "refactor: simplify useRoom hook logic"
git commit -m "docs: update game development guide"
git commit -m "chore: update mantine to v7.4"
```

## Branches

- `main` — Production-Branch, nur über PRs
- `staging` — Staging-Branch, Deployment zu Railway Staging wird automatisch ausgelöst
- Feature-Branches: `feat/<beschreibung>`, `fix/<beschreibung>`, etc.

## Pre-Commit Hook (lint-staged)

Vor jedem Commit laufen automatisch:
1. `prettier --write` auf geänderte `src/**/*.{js,jsx,ts,tsx}`
2. `eslint --fix` auf geänderte `src/**/*.{js,jsx,ts,tsx}`
3. `eslint` (strict) auf geänderte `src/**/*.{js,jsx,ts,tsx}`
4. `prettier --write` auf geänderte `src/**/*.{json,css,md}`

## CI/CD Pipeline

Beim Push auf `staging`:
1. Check ob Deployment nötig (nur bei Änderungen in relevanten Dateien)
2. Parallele Jobs: Lint → TypeCheck → Tests → Build
3. Deploy zu Railway Staging

PRs triggern `pr-checks.yml` für Validierungen.

## Versioning

- Semantic Versioning (SemVer) via `release.yml` (manuell ausgelöst)
- Version in `package.json` wird automatisch gebumpt
