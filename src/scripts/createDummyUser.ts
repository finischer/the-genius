import { prisma } from "~/server/db";
import bcrypt from "bcrypt";

async function createDummyUser() {
  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.create({
    data: {
      name: "Dummy User",
      username: "dummyuser",
      email: "dummyuser@example.com",
      password: hashedPassword,
      role: "USER",
      isEmailVerified: true
    }
  });

  console.log("Dummy user created");
}

createDummyUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
