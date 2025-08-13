# TheGenius

TheGenius is a game show application that allows users to create their own game show and play it with friends. The project is inspired by the game show "Brain Battle", which appears on the YouTube channel [PietSmiet](https://www.pietsmiet.de/).

## Techstack

All technologies you should be familiar with.

- [Next.JS](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TRPC](https://trpc.io/)
- [MongoDB](https://www.mongodb.com/de-de)
- [ReactJS](https://react.dev/)
- [Partykit](https://www.partykit.io/)
- [Typescript](https://www.typescriptlang.org/)

Also we use [Mantine](https://mantine.dev/) to customize our UI React Components

## Set up local environment

Requirements:

- [Docker](https://docs.docker.com/desktop/)
- [Node.JS ](https://nodejs.org/de)

### Create environment variables

Step 1: Create a file called .env.local  
Step 2: Insert the following environment variables

```
MONGODB_URI="mongodb://admin:password@localhost:27017/db?authSource=admin&retryWrites=true&w=majority"
```

Step 3: Create a file called .env.development
Step 4: Insert the following environment variables

```
NODE_ENV="development"
MONGODB_URI="<FILL_IN>"
NEXTAUTH_SECRET="<FILL_IN>"
```

**Note:** .env.local will overwrite every other env variable in other env files

### Prepare Docker Container

Step 1: open new terminal  
Step 2: Run command

```
docker-compose up -d
```

### Run tests

```
npm run test:unit

npm run test:unit:watch
```

### Start next.js Server

Step 1: Open new terminal  
Step 2: Run command

```
npm run dev
```

### Commitlint and Husky

We use `commitlint` and `husky` to enforce consistent commit messages and run pre-commit hooks.

- **Commitlint**: Ensures that commit messages follow a specified convention. This helps in maintaining a clean and readable commit history.
- **Husky**: Allows us to run scripts at various stages of the Git lifecycle, such as before commits or pushes. We use it to run `commitlint` before each commit.

To make a commit, follow these steps:

1. Stage your changes:

```
git add .
```

2. Commit your changes:

```
git commit -m "docs: update README.md"
```

### Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) style for commit messages. This convention uses a structured format for commit messages, which helps in maintaining a clean and readable commit history. Here are some examples of conventional commit messages:

- `feat: add new user authentication feature`
- `fix: resolve issue with user login`
- `docs: update README.md with new instructions`
- `style: improve code formatting`
- `refactor: simplify user service logic`
- `test: add unit tests for user service`

Make sure to follow the commit message guidelines specified in the project.

### Additional hints

Prisma will run on Port: 4466  
Webiste will run on Port: 3000  
MongoDB will run on Port: 27017

## 🎮 Game Development Guide

### Adding a New Game + Configurator

TheGenius uses a simplified game system that makes adding new games incredibly easy. Follow this step-by-step guide:

#### Step 1: Create Game Types & Configuration

Create your game folder: `src/games/YourGameName/`

**File: `src/games/YourGameName/yourgame.types.ts`**
```typescript
// Define your game-specific state interface
export interface IYourGameState {
  // Add your game-specific properties here
  exampleProperty: string;
  anotherProperty: number;
}
```

**File: `src/games/YourGameName/config.ts`**
```typescript
import { Game, type IGameGeneralState } from "../core/types";
import { type IYourGameState } from "./yourgame.types";

export type TYourGameGameState = IYourGameState & IGameGeneralState;

export const DEFAULT_YOUR_GAME_STATE: TYourGameGameState = {
  identifier: Game.YOUR_GAME,
  name: "Your Game Name",
  modes: ["DUELL", "TEAM"],
  maxPoints: 10,
  scorebarMode: "number",
  exampleProperty: "default value",
  anotherProperty: 5,
  rules: `
Spiel: {{ gameName }}

### Ziel:
Beschreibe hier das Ziel deines Spiels.

### Spielablauf:
Erkläre hier den Spielablauf...

Maximum: {{ maxPoints }} {{#if maxPoints.equalOne}}Punkt{{else}}Punkte{{/if}}
  `
};
```

#### Step 2: Create Game Component

**File: `src/games/YourGameName/YourGameGame.tsx`**
```typescript
import React from "react";
import { Box, Card, Text, Button, Stack } from "@mantine/core";
import { type IGameProps } from "../core/types";
import { type TYourGameGameState } from "./config";

interface YourGameGameProps extends IGameProps {
  game: TYourGameGameState;
}

const YourGameGame: React.FC<YourGameGameProps> = ({ game }) => {
  return (
    <Stack gap="lg" p="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="xl" fw={500} ta="center" mb="md">
          {game.name}
        </Text>
        <Text ta="center" c="dimmed">
          Max. Punkte: {game.maxPoints}
        </Text>
        <Text ta="center" c="dimmed">
          Example Property: {game.exampleProperty}
        </Text>
      </Card>
      {/* Add your game logic here */}
      <Box ta="center">
        <Button size="lg">
          Start Game
        </Button>
      </Box>
    </Stack>
  );
};

export default YourGameGame;
```

#### Step 3: Create Configurator with useGameshowConfig Hook

**File: `src/components/gameshows/YourGameConfigurator/YourGameConfigurator.tsx`**
```typescript
import React from "react";
import { Stack, Card, Text, TextInput, NumberInput } from "@mantine/core";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import { Game } from "~/games";

const YourGameConfigurator: React.FC = () => {
  const { updateGame, [Game.YOUR_GAME]: gameState } = useGameshowConfig(Game.YOUR_GAME);

  const updateGameState = (updates: Partial<typeof gameState>) => {
    updateGame((draft) => {
      Object.assign(draft, updates);
    });
  };

  if (!gameState) return null;

  return (
    <Stack gap="lg">
      <Card withBorder>
        <Text fw={600} mb="md">Grundeinstellungen</Text>
        <TextInput
          label="Example Property"
          value={gameState.exampleProperty}
          onChange={(e) => updateGameState({ exampleProperty: e.target.value })}
          placeholder="Enter example value..."
        />
        <NumberInput
          label="Another Property"
          value={gameState.anotherProperty}
          onChange={(value) => updateGameState({ anotherProperty: Number(value) || 0 })}
          min={0}
          max={100}
        />
      </Card>
    </Stack>
  );
};

export default YourGameConfigurator;
```

#### Step 4: Add Game to System

**1. Add to Game Enum** (`src/games/core/types.ts`):
```typescript
export enum Game {
  // ... existing games
  YOUR_GAME = "yourGame"
}
```

**2. Add to TGameSettingsMap** (`src/games/core/types.ts`):
```typescript
export interface TGameSettingsMap {
  // ... existing games
  [Game.YOUR_GAME]: TYourGameGameState;
}
```

**3. Register in games.config.ts** (`src/games/core/games.config.ts`):
```typescript
// Add imports at the top
import { DEFAULT_YOUR_GAME_STATE } from "../YourGameName/config";
import YourGameConfigurator from "~/components/gameshows/YourGameConfigurator/YourGameConfigurator";
import YourGameGame from "../YourGameName/YourGameGame";

// Add to GAME_CONFIGS array
{
  identifier: Game.YOUR_GAME,
  name: "Your Game Name",
  defaultState: DEFAULT_YOUR_GAME_STATE,
  configurator: YourGameConfigurator as React.ComponentType<unknown>,
  gameComponent: YourGameGame as React.ComponentType<unknown>
}
```

#### Step 5: Create Index Export

**File: `src/games/YourGameName/index.ts`**
```typescript
export { default as YourGameGame } from "./YourGameGame";
export { DEFAULT_YOUR_GAME_STATE } from "./config";
export type { TYourGameGameState } from "./config";
export type { IYourGameState } from "./yourgame.types";
```

### 🎯 That's it! Your game is now fully integrated!

**What you get automatically:**
- ✅ Game appears in game selection
- ✅ Configurator works in gameshow creation
- ✅ Game state persistence
- ✅ Type safety throughout
- ✅ Hot reload support

### Example Implementation

See the complete example in `src/examples/ExampleGame/` for a fully functional reference implementation.

### useGameshowConfig Hook Features

The `useGameshowConfig` hook provides:
- `updateGame()` - Update specific game configuration
- `updateGameshowMetadata()` - Update gameshow metadata
- `updateGameList()` - Update the list of games
- `gameshow` - Current gameshow state
- `[gameName]` - Direct access to your game's state

```typescript
const { updateGame, [Game.YOUR_GAME]: gameState } = useGameshowConfig(Game.YOUR_GAME);

// Update your game state
updateGame((draft) => {
  draft.exampleProperty = "new value";
});
```

### Best Practices

1. **Use TypeScript interfaces** for clean type definitions
2. **Leverage useGameshowConfig** for state management
3. **Follow naming conventions** (PascalCase for components)
4. **Add comprehensive rules** in the config template
5. **Test configurator thoroughly** before deploying
