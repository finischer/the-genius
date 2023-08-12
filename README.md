# TheGenius

TheGenius is a game show application that allows users to create their own game show and play it with friends. The project is inspired by the game show "Brain Battle", which appears on the YouTube channel [PietSmiet](https://www.pietsmiet.de/).

## Techstack

All technologies you should be familiar with.

- [Next.JS](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TRPC](https://trpc.io/)
- [MongoDB](https://www.mongodb.com/de-de)
- [ReactJS](https://react.dev/)
- [Socket.IO](https://socket.io/)
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

### Start next.js Server

Step 1: Open new terminal  
Step 2: Run command

```
npm run dev
```

### Additional hints

Prisma will run on Port: 4466  
Webiste will run in Port: 3000  
MongoDB will run on Port: 27017
