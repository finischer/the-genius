import type { Prisma } from "~/generated/prisma/client";

export function createUserSeed(
  overrides: Partial<Prisma.UserCreateInput> &
    Pick<Prisma.UserCreateInput, "email" | "name" | "username">
): Prisma.UserCreateInput {
  return {
    role: "USER",
    isEmailVerified: true,
    password: "password",
    isFirstVisit: false,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

// Named first-class users (used in gameshows/feedbacks by email)
const NAMED_USERS: Prisma.UserCreateInput[] = [
  createUserSeed({ name: "Walter White", username: "heisenberg", email: "walter@thegenius.local", role: "ADMIN" }),
  createUserSeed({ name: "Max Mustermann", username: "xX_MaxPower_Xx", email: "max@thegenius.local", role: "PREMIUM" }),
  createUserSeed({ name: "Sophie Müller", username: "sofiii", email: "sophie@thegenius.local", role: "PREMIUM" }),
  createUserSeed({ name: "Jonas Weber", username: "j0nas_w", email: "jonas@thegenius.local" }),
  createUserSeed({ name: "Laura Schmidt", username: "lauraaa", email: "laura@thegenius.local" }),
  createUserSeed({ name: "Tim Becker", username: "tb", email: "tim@thegenius.local" }),
  createUserSeed({ name: "Anna Hoffmann", username: "quiz_anna", email: "anna@thegenius.local" }),
  createUserSeed({ name: "Felix Wagner", username: "felixthegreat99", email: "felix@thegenius.local" }),
  createUserSeed({ name: "Lena Schulz", username: "lena", email: "lena@thegenius.local", role: "PREMIUM" }),
  createUserSeed({ name: "David Braun", username: "d4v1d", email: "david@thegenius.local" })
];

// Pool of creative usernames – mixed lengths and styles
const USERNAME_POOL = [
  "blitz", "nachtfalke", "quiz_king", "mr_wissen", "brainiac99", "der_echte_profi",
  "wissensdurst", "zz", "fragenheld", "punktejaeger", "ratemeister", "schnelldenker",
  "superfuchs", "quizgott", "denkmaschine", "antwortgeber", "px", "rocketbrain",
  "der_unbesiegbare", "fragenfuchs", "buzzerwizard", "kl", "mindmaster", "top_scorer",
  "spieleabend_king", "antwortmaschine", "quizcrack", "wissenshunger", "rx7",
  "der_gelehrte", "punktesammler", "blitzdenkerin", "nerdqueen", "th3_brain",
  "quizfluesterer", "wissensweltmeister", "antwortgott", "fragensteller", "mr_correct",
  "buzzerheld", "denkrekord", "quizphoenix", "wissensrakete", "punkteking99",
  "ratekoenig", "gameshowstar", "clevermind", "iq_off_charts", "ms_smartypants",
  "quizlegend", "antwortblitz", "superwissen", "hirnakrobat", "denkturbo",
  "quizmaster3000", "wm", "wissensbombe", "fragenpiratin", "topantwort",
  "schnellantworter", "gelehrtewelt", "brainwave42", "punktefuchs", "quizweltmeister",
  "denkflash", "wissensmaschine", "antwortheld", "ratestar", "quizprofi2024",
  "fragengott", "buzzqueen", "denkrekordler", "zk", "wissensturbo", "antwortrakete",
  "quizlegende", "hirnpower", "superbrainer", "fragenweltmeister", "punkterekord",
  "denkblitz", "wissensflash", "antwortstar", "quizrekord", "rateheld",
  "braingamer", "wissensriese", "fragenchampion", "antwortchampion", "quizchampion",
  "denkchampion", "wissensgott", "superrater", "fragenspezialist", "punktespezialist",
  "quizspezialist", "denkspezialist", "wissensspezialist", "antwortspezialist", "ms_trivia",
  "herr_wissen", "frau_clever", "quiz_ninja"
];

function generateCommunityUsers(): Prisma.UserCreateInput[] {
  const users: Prisma.UserCreateInput[] = [];

  const firstNames = ["Lukas", "Emma", "Noah", "Mia", "Leon", "Hannah", "Finn", "Lena", "Paul", "Lea", "Ben", "Julia", "Elias", "Sara", "Moritz", "Lara", "Luis", "Nina", "Jan", "Clara", "Tom", "Marie", "Nico", "Lisa", "Simon", "Katharina", "Kevin", "Sarah", "Daniel", "Leonie", "Tobias", "Amelie", "Patrick", "Charlotte", "Michael", "Franziska", "Stefan", "Johanna", "Sebastian", "Elena", "Markus", "Viktoria", "Andreas", "Alina", "Florian", "Nathalie", "Christian", "Isabel", "Alexander", "Melissa"];
  const lastNames = ["Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schröder", "Neumann", "Schwarz", "Zimmermann", "Braun", "Krüger", "Hofmann", "Hartmann", "Lange", "Schmitt", "Werner", "Krause", "Meier", "Lehmann", "Schmid"];

  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[i % firstNames.length]!;
    const lastName = lastNames[i % lastNames.length]!;
    const suffix = Math.floor(i / firstNames.length);
    const emailHandle = `${firstName.toLowerCase()}${lastName.toLowerCase()}${suffix > 0 ? suffix : ""}`;
    const email = `${emailHandle}@thegenius.local`;
    const username = USERNAME_POOL[i % USERNAME_POOL.length]!;
    const role = i % 15 === 0 ? "PREMIUM" : "USER";

    users.push(createUserSeed({ name: `${firstName} ${lastName}`, username, email, role }));
  }

  return users;
}

export const SEED_USERS: Prisma.UserCreateInput[] = [
  ...NAMED_USERS,
  ...generateCommunityUsers()
];
