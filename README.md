# TheGenius

TheGenius is a game show application that allows users to create their own game show and play it with friends. The project is inspired by the game show "Brain Battle", which appears on the YouTube channel [PietSmiet](https://www.pietsmiet.de/).

## Techstack

All technologies you should be familiar with.

- [Next.JS](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TRPC](https://trpc.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [ReactJS](https://react.dev/)
- [Partykit](https://www.partykit.io/)
- [Typescript](https://www.typescriptlang.org/)

Also we use [Mantine](https://mantine.dev/) to customize our UI React Components

## Local Development Setup

### Prerequisites

Make sure you have the following installed:

- [Bun](https://bun.sh/) (package manager & runtime)
- [Docker](https://docs.docker.com/desktop/) (for the local PostgreSQL container)
- [Node.js](https://nodejs.org/) v24+

### Step-by-step

**1. Clone the repository**

```bash
git clone <repo-url>
cd the-genius
```

**2. Install dependencies**

```bash
bun install
```

**3. Set up environment variables**

Copy the example file and fill in the required values:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your secrets. For local development, the database URL is pre-configured to match the Docker container:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/the_genius?schema=public"
NEXTAUTH_SECRET="any-random-string-works-locally"
NODE_ENV="development"
NEXT_PUBLIC_THE_GENIUS_ENV="development"
WEBSITE_URL="http://localhost:3000"
```

OAuth credentials (`GOOGLE_CLIENT_ID`, `DISCORD_CLIENT_ID` etc.) are only required if you want to test social login locally. For local-only development, the built-in credentials provider works without them.

**4. Start the database**

```bash
bun run db:start
```

This starts a PostgreSQL container on port `5432`. Run `bun run db:stop` to shut it down.

**5. Run database migrations**

```bash
bun run db:migrate
```

This applies all migrations including the game seed data.

**6. Start the Next.js dev server**

```bash
bun run dev
```

App is now running at [http://localhost:3000](http://localhost:3000).

---

### Available ports

| Service | Port |
|---|---|
| Next.js | 3000 |
| PostgreSQL | 5432 |
| Prisma Studio | 4466 |

### Commitlint and Husky

We use `commitlint` and `husky` to enforce consistent commit messages and run pre-commit hooks.

- **Commitlint**: Ensures that commit messages follow a specified convention. This helps in maintaining a clean and readable commit history.
- **Husky**: Allows us to run scripts at various stages of the Git lifecycle, such as before commits or pushes. We use it to run `commitlint` before each commit.

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
Website will run on Port: 3000  
PostgreSQL will run on Port: 5432
