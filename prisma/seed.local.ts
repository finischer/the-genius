import { prisma } from "~/server/db";

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "dummyuser@example.com" }
  });

  if (existing) {
    console.log("Dummy user already exists, skipping.");
    return;
  }

  await prisma.user.create({
    data: {
      name: "Admin",
      username: "admin",
      role: "ADMIN",
      email: "dummyuser@example.com",
      isEmailVerified: true,
      password: "password",
      isFirstVisit: false,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log("Dummy user created: dummyuser@example.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
