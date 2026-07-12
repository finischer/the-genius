# UI & Komponenten

## UI-Bibliothek: Mantine v7

**Ausschließlich Mantine** für UI-Komponenten verwenden. Kein Tailwind, kein Material UI, kein Chakra.

```ts
import { Button, Stack, Card, Text, Group, Box } from "@mantine/core";
```

### Häufig verwendete Pakete

| Paket | Verwendung |
|---|---|
| `@mantine/core` | Basis-Komponenten (Button, Input, Card, ...) |
| `@mantine/hooks` | UI-Hooks (useDisclosure, useMediaQuery, ...) |
| `@mantine/form` | Formular-State-Management |
| `@mantine/notifications` | Toast-Benachrichtigungen |
| `@mantine/modals` | Modal-Manager |
| `@mantine/dates` | Datepicker etc. |
| `@tabler/icons-react` | Icons |

### PostCSS / Mantine CSS Variables

Mantine-CSS-Variablen können in CSS-Modulen verwendet werden:

```css
.card {
  background: var(--mantine-color-dark-6);
  border-radius: var(--mantine-radius-md);
}
```

PostCSS-Konfiguration: `postcss-preset-mantine` + `postcss-simple-vars`.

## Icons

Nur `@tabler/icons-react` verwenden:

```ts
import { IconTrophy, IconSettings } from "@tabler/icons-react";
```

## Animationen

`framer-motion` für Animationen:

```ts
import { motion } from "framer-motion";
```

## Komponenten-Patterns

### Standard-Komponente

```tsx
import React from "react";
import { Stack, Text } from "@mantine/core";

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, children }) => {
  return (
    <Stack gap="md">
      <Text fw={600}>{title}</Text>
      {children}
    </Stack>
  );
};

export default MyComponent;
```

### Index-Export

Jede Komponente hat eine `index.ts`:

```ts
export { default } from "./MyComponent";
export { default as MyComponent } from "./MyComponent";
```

## Formular-Pattern mit Mantine Form

```ts
import { useForm } from "@mantine/form";

const form = useForm({
  initialValues: { name: "", score: 0 },
  validate: {
    name: (value) => value.trim().length === 0 ? "Name ist erforderlich" : null
  }
});
```

## Notifications

```ts
import { notifications } from "@mantine/notifications";

notifications.show({
  title: "Erfolg",
  message: "Gameshow wurde gespeichert",
  color: "green"
});
```

## Responsive Design

Mantine's `useMediaQuery` Hook oder responsive Props verwenden:

```tsx
// Responsive Props
<Stack gap={{ base: "sm", md: "lg" }}>

// Hook
import { useMediaQuery } from "@mantine/hooks";
const isMobile = useMediaQuery("(max-width: 768px)");
```

## Spielinhalte

Spielnamen, Regeln und UI-Texte sind auf **Deutsch**. Technische Bezeichner (Variablen, Funktionen, Props) sind auf Englisch.
