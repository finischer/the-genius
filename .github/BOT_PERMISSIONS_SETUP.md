# Bot Permissions Setup für Automatische Versionierung

## Problem
Der GitHub Actions Bot muss auf den `staging` Branch pushen können, um die Version zu erhöhen. Je nach Branch Protection Rules kann das Standard `GITHUB_TOKEN` dafür nicht ausreichen.

---

## ✅ Option 1: Repository Settings anpassen (Einfachste Lösung)

### Schritt 1: Workflow Permissions erhöhen
1. Gehe zu **Settings** → **Actions** → **General**
2. Scrolle zu **Workflow permissions**
3. Wähle: **Read and write permissions** ✅
4. Aktiviere: **Allow GitHub Actions to create and approve pull requests** ✅
5. Speichern

### Schritt 2: Branch Protection anpassen (falls aktiv)
1. Gehe zu **Settings** → **Branches** → **Branch protection rules**
2. Wähle die Regel für `staging`
3. Unter **"Restrict who can push to matching branches"**:
   - Füge `github-actions[bot]` hinzu oder
   - Deaktiviere die Restriktion ganz
4. Speichern

**Vorteil:** Keine zusätzlichen Secrets nötig  
**Nachteil:** Bot hat mehr Rechte im gesamten Repo

---

## ✅ Option 2: Personal Access Token (PAT) verwenden (Sicherer)

### Schritt 1: PAT erstellen
1. Gehe zu GitHub → **Settings** (dein Profil, nicht Repo!)
2. **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token** (classic)
4. **Name:** `Release Bot Token`
5. **Expiration:** Wähle sinnvollen Zeitraum (z.B. 1 Jahr)
6. **Scopes:** Aktiviere:
   - ✅ `repo` (alle Sub-Scopes)
   - ✅ `workflow`
7. **Generate token** und kopiere den Token! ⚠️ Nur einmal sichtbar!

### Schritt 2: Secret im Repository hinzufügen
1. Gehe zum Repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. **Name:** `BOT_PAT`
4. **Value:** Füge den kopierten Token ein
5. **Add secret**

### Schritt 3: Branch Protection anpassen (falls aktiv)
1. Gehe zu **Settings** → **Branches** → **Branch protection rules**
2. Wähle die Regel für `staging`
3. Unter **"Restrict who can push to matching branches"**:
   - Füge den Account hinzu, der den PAT erstellt hat
4. Speichern

**Vorteil:** Präzise Kontrolle, PAT kann widerrufen werden  
**Nachteil:** Token muss erneuert werden (Expiration)

---

## ✅ Option 3: GitHub App verwenden (Professionell)

Für Enterprise/Teams empfohlen:
1. Erstelle eine GitHub App mit Push-Rechten
2. Installiere die App im Repository
3. Verwende App-Credentials im Workflow

[Anleitung hier](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps)

---

## Wie erkenne ich, welche Option ich brauche?

### Test durchführen:
1. Erstelle einen Test-PR von `staging` → `production`
2. Der Workflow `version-bump-on-pr.yml` läuft
3. Schaue in die Logs:

**✅ Erfolg:** "Successfully pushed to staging"  
→ Alles gut! Keine weiteren Schritte nötig.

**❌ Fehler:** "Protected branch push failed" oder "Permission denied"  
→ Branch Protection aktiv → **Option 1 oder 2** verwenden

**❌ Fehler:** "Resource not accessible by integration"  
→ Workflow Permissions zu niedrig → **Option 1** verwenden

---

## Aktueller Workflow-Status

Der Workflow ist bereits vorbereitet:
- Versucht zuerst `BOT_PAT` zu verwenden (Option 2)
- Fällt zurück auf `GITHUB_TOKEN` wenn kein PAT vorhanden (Option 1)
- Hat Retry-Logik bei temporären Fehlern
- Gibt hilfreiche Fehlermeldungen aus

**Du musst nur entscheiden, welche Option du verwenden möchtest!**

---

## Empfehlung

Für dein Setup empfehle ich **Option 1** (Repository Settings):
- ✅ Schnell eingerichtet
- ✅ Kein Token-Management
- ✅ Ausreichend für private Repos
- ⚠️ Nur wenn du dem Bot vertraust

Falls du sehr strenge Branch Protection brauchst → **Option 2** (PAT)

---

## Troubleshooting

### Problem: "remote: Permission to ... denied"
**Lösung:** Option 1 oder 2 durchführen

### Problem: "remote: Protected branch update failed"
**Lösung:** Branch Protection Rules anpassen (siehe Option 1, Schritt 2)

### Problem: Workflow läuft nicht
**Lösung:** Prüfe ob der PR wirklich von `staging` kommt (exakter Branch-Name!)

### Problem: Version wird nicht erhöht
**Lösung:** Prüfe die Logs - der Workflow zeigt genau an was schief läuft
