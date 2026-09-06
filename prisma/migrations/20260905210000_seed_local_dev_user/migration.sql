-- Local development only: inserts a test user for the LocalCredentialsProvider.
-- Email: dummyuser@example.com / Password: password
INSERT INTO "users" (
  "id",
  "name",
  "username",
  "role",
  "email",
  "isEmailVerified",
  "password",
  "isFirstVisit",
  "lastLoginAt",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Admin',
  'admin',
  'ADMIN',
  'dummyuser@example.com',
  true,
  'password',
  false,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT ("email") DO NOTHING;
