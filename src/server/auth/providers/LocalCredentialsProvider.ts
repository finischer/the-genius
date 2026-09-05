import { UserRole } from "~/generated/prisma/client";
import NextAuthCredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "~/server/db";

export default NextAuthCredentialsProvider({
  name: "Credentials",
  credentials: {
    email: {
      label: "Email",
      type: "text",
      placeholder: "jsmith@example.com"
    },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    // Hier kannst du z.B. via Prisma nach dem entsprechenden Nutzer suchen
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Bitte Email und Passwort eingeben");
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user) {
      throw new Error("Kein User mit dieser Email gefunden");
    }

    // Beispielhaft ein Passwort-Check (der Einfachheit halber Plaintext)
    // In einer echten App natürlich mit Hashing/Bcrypt verifizieren!
    if (user.password !== credentials.password) {
      throw new Error("Falsches Passwort");
    }

    // Falls alles passt, gebe das Nutzer-Objekt zurück

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      role: user.role ?? UserRole.ADMIN,
      username: user.username ?? undefined
    };
  }
});
