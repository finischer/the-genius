# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buzzer.spec.ts >> Buzzer-Logik >> Buzzer-Druck via Spacebar – Highlight und Timer
- Location: e2e/tests/buzzer.spec.ts:61:7

# Error details

```
Test timeout of 30000ms exceeded while setting up "authenticatedContext".
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - img "the-genius-logo" [ref=e7]
      - paragraph [ref=e9]: The Genius
      - heading "Willkommen zurück!" [level=2] [ref=e10]
      - button "Als Walter White einloggen" [ref=e12] [cursor=pointer]
    - generic [ref=e15]:
      - link [ref=e16] [cursor=pointer]:
        - /url: /impressum
        - paragraph [ref=e17]: Impressum
      - link [ref=e18] [cursor=pointer]:
        - /url: /datenschutz
        - paragraph [ref=e19]: Datenschutz
  - button "Open Next.js Dev Tools" [ref=e25] [cursor=pointer]
  - alert [ref=e29]
```